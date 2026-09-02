-- Urban-Mart admin schema
-- Run this AFTER supabase/schema.sql, in the SQL Editor.
-- Adds: a scalable roles/user_roles system, admin-only RLS policies on
-- existing tables, and a `products` table (moving product data from the
-- static src/data/products.ts into the database so admins can edit it).

-- ---------------------------------------------------------------------
-- roles + user_roles: many-to-many, so a user could hold multiple roles
-- later (e.g. "admin" + "support") without a schema change.
-- ---------------------------------------------------------------------
create table if not exists public.roles (
  id smallint primary key generated always as identity,
  name text not null unique
);

insert into public.roles (name) values ('admin'), ('customer')
on conflict (name) do nothing;

create table if not exists public.user_roles (
  user_id uuid not null references auth.users (id) on delete cascade,
  role_id smallint not null references public.roles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, role_id)
);

alter table public.user_roles enable row level security;

-- Users can see their own role assignments (needed so the frontend can
-- check "am I an admin" for the signed-in user).
create policy "Users can view their own roles"
  on public.user_roles for select
  using (auth.uid() = user_id);

-- Helper used inside RLS policies below — SECURITY DEFINER so it can read
-- user_roles regardless of the calling user's own row-level access.
create or replace function public.has_role(check_user_id uuid, role_name text)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.user_roles ur
    join public.roles r on r.id = ur.role_id
    where ur.user_id = check_user_id and r.name = role_name
  );
$$;

-- Admins can view and manage every user's role assignments (to promote /
-- demote other users from the admin dashboard).
create policy "Admins can manage all user roles"
  on public.user_roles for all
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- To make your own account an admin after running this file:
--   1. Sign up / sign in through the app once, so a row exists in auth.users.
--   2. Run:
--      insert into public.user_roles (user_id, role_id)
--      select id, (select id from public.roles where name = 'admin')
--      from auth.users where email = 'you@example.com';

-- ---------------------------------------------------------------------
-- profiles.email — PostgREST doesn't expose the auth schema to clients,
-- so admins can't join against auth.users directly. Denormalizing email
-- onto profiles (kept in sync at signup) is the simplest way to show it
-- in the admin Users table.
-- ---------------------------------------------------------------------
alter table public.profiles add column if not exists email text;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, first_name, last_name, email)
  values (
    new.id,
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name',
    new.email
  )
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;

-- One-time backfill for accounts created before this migration ran (the
-- SQL Editor connects with elevated access, so it can read auth.users
-- even though the app's normal client can't):
update public.profiles p
set email = u.email
from auth.users u
where p.id = u.id and p.email is null;

-- ---------------------------------------------------------------------
-- Admin RLS additions on top of schema.sql's existing tables
-- ---------------------------------------------------------------------

-- profiles: admins can view every profile (for the Users table).
create policy "Admins can view all profiles"
  on public.profiles for select
  using (public.has_role(auth.uid(), 'admin'));

-- orders: admins can view every order and update status (Processing /
-- Shipped / Delivered / Cancelled) from the dashboard.
create policy "Admins can view all orders"
  on public.orders for select
  using (public.has_role(auth.uid(), 'admin'));

create policy "Admins can update any order"
  on public.orders for update
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- ---------------------------------------------------------------------
-- products: moved from static src/data/products.ts into the database.
-- Publicly readable (it's a storefront catalog), writable by admins only.
-- ---------------------------------------------------------------------
create table if not exists public.products (
  id integer primary key,
  sku text not null unique,
  name text not null,
  category text not null,
  price numeric(10, 2) not null,
  compare_at_price numeric(10, 2),
  description text not null,
  details text[] not null default '{}',
  images text[] not null default '{}',
  rating numeric(2, 1) not null default 0,
  review_count integer not null default 0,
  stock integer not null default 0,
  badge text,
  colors text[] not null default '{}',
  tags text[] not null default '{}',
  featured boolean not null default false,
  is_new boolean not null default false,
  best_seller boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.products enable row level security;

create policy "Anyone can view products"
  on public.products for select
  using (true);

create policy "Admins can insert products"
  on public.products for insert
  with check (public.has_role(auth.uid(), 'admin'));

create policy "Admins can update products"
  on public.products for update
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

create policy "Admins can delete products"
  on public.products for delete
  using (public.has_role(auth.uid(), 'admin'));

-- Keep updated_at current on every edit.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_products_updated_at on public.products;
create trigger set_products_updated_at
  before update on public.products
  for each row execute procedure public.set_updated_at();

-- Seed data: the 26 products that used to live in src/data/products.ts.
insert into public.products
  (id, sku, name, category, price, compare_at_price, description, details, images, rating, review_count, stock, badge, colors, tags, featured, is_new, best_seller)
values
(1, 'UM-EDC-101', 'Ridge Multi-Tool', 'Everyday Carry', 48, 62, 'A 14-function multi-tool machined from stonewashed stainless steel, built to live in a pocket and work like a full toolbox.', ARRAY['420 stainless steel, stonewashed finish', '14 tools including pliers, drivers, and blade', 'Folding lock mechanism, one-hand deploy', 'Includes nylon EDC pouch']::text[], ARRAY['https://images.unsplash.com/photo-1605468424365-bac89e69cc4a?w=1200&q=80&auto=format&fit=crop']::text[], 4.8, 214, 34, 'Best Seller', ARRAY['Steel', 'Black Oxide']::text[], ARRAY['multitool', 'steel', 'pocket', 'everyday carry']::text[], true, false, true),
(2, 'UM-LGT-204', 'Urban Desk Lamp', 'Lighting', 79, NULL, 'A weighted, articulating desk lamp with a warm-dimmable LED head and a satin-anodized aluminum arm.', ARRAY['Stepless dimming, 2700K–4000K adjustable', 'Weighted die-cast base, no clamp required', 'USB-C input, 5W low-draw LED', 'Touch control on base']::text[], ARRAY['https://images.unsplash.com/photo-1605194004886-56d82f482d53?w=1200&q=80&auto=format&fit=crop']::text[], 4.7, 156, 22, 'New', ARRAY['Charcoal', 'Warm Gray']::text[], ARRAY['lamp', 'desk', 'lighting', 'led']::text[], true, true, false),
(3, 'UM-STR-317', 'Metro Storage Case', 'Storage', 64, NULL, 'A stackable, latch-sealed storage case with a modular tray insert — built for gear that needs to stay organized and dry.', ARRAY['Impact-resistant polymer shell', 'Weather-sealed gasket lid', 'Modular divider tray included', 'Stacks and locks with matching units']::text[], ARRAY['https://images.unsplash.com/photo-1583686298564-46fbffda0707?w=1200&q=80&auto=format&fit=crop']::text[], 4.6, 98, 41, NULL, ARRAY['Graphite', 'Sand']::text[], ARRAY['storage', 'case', 'organization']::text[], true, false, false),
(4, 'UM-TRV-412', 'Arc Travel Organizer', 'Travel', 38, NULL, 'A compact tech and cable organizer with dedicated slots for chargers, cords, and small electronics — built for carry-on travel.', ARRAY['Water-resistant recycled ripstop nylon', 'Elastic loops for cables and adapters', 'Mesh zip pocket for small items', 'Folds flat, packs in any bag']::text[], ARRAY['https://images.unsplash.com/photo-1448582649076-3981753123b5?w=1200&q=80&auto=format&fit=crop']::text[], 4.5, 87, 56, NULL, ARRAY['Black', 'Olive']::text[], ARRAY['travel', 'organizer', 'cables']::text[], true, false, false),
(5, 'UM-EDC-108', 'Core Everyday Backpack', 'Everyday Carry', 128, 150, 'A 22L daily backpack with a dedicated laptop sleeve, quick-access front pocket, and a structured silhouette that holds its shape.', ARRAY['600D recycled polyester, water-resistant', 'Padded 16" laptop sleeve', 'Magnetic quick-access pocket', 'Load-bearing sternum strap']::text[], ARRAY['https://images.unsplash.com/photo-1594299447935-e5b840f54b9b?w=1200&q=80&auto=format&fit=crop']::text[], 4.9, 302, 18, 'Best Seller', ARRAY['Black', 'Slate', 'Olive']::text[], ARRAY['backpack', 'daily', 'laptop']::text[], true, false, true),
(6, 'UM-LGT-209', 'Flux LED Lantern', 'Lighting', 42, NULL, 'A collapsible lantern with three brightness modes, a built-in power bank, and a silicone shade that folds flat for storage.', ARRAY['300 lumen max output, 3 brightness modes', 'Doubles as a 4000mAh power bank', 'Collapses to 1.5" for storage', 'IPX4 splash resistant']::text[], ARRAY['https://images.unsplash.com/photo-1605194004886-56d82f482d53?w=1200&q=80&auto=format&fit=crop']::text[], 4.4, 63, 47, NULL, ARRAY['Charcoal']::text[], ARRAY['lantern', 'led', 'outdoor', 'power bank']::text[], false, false, false),
(7, 'UM-TCH-501', 'Grid Cable Organizer', 'Tech Accessories', 22, NULL, 'A modular cable tray with a felt-lined channel system that keeps cords, chargers, and adapters exactly where you left them.', ARRAY['Felt-lined aluminum tray', 'Six-channel cable routing', 'Non-slip base pads', 'Fits under-desk or on top']::text[], ARRAY['https://images.unsplash.com/photo-1749048575579-c6f995615893?w=1200&q=80&auto=format&fit=crop']::text[], 4.3, 74, 63, NULL, ARRAY['Gray', 'Black']::text[], ARRAY['cables', 'desk', 'organization']::text[], false, false, false),
(8, 'UM-TLS-620', 'Axis Mechanical Timer', 'Tools', 34, NULL, 'A knurled-aluminum mechanical countdown timer for the workshop, kitchen, or desk — no batteries, no app, just a satisfying twist.', ARRAY['60-minute mechanical countdown', 'Machined aluminum housing', 'Magnetic back and kickstand', 'Audible bell at zero']::text[], ARRAY['https://images.unsplash.com/photo-1756027583186-a04a19e4f6ce?w=1200&q=80&auto=format&fit=crop']::text[], 4.6, 51, 39, 'New', ARRAY['Silver']::text[], ARRAY['timer', 'workshop', 'desk']::text[], false, true, false),
(9, 'UM-TCH-507', 'Nomad Tech Pouch', 'Tech Accessories', 36, NULL, 'A structured zip pouch sized for a charger, cables, a battery pack, and the rest of your everyday tech kit.', ARRAY['Water-resistant coated canvas', 'YKK zipper, double pull', 'Internal elastic organization', 'Fits inside most daypacks']::text[], ARRAY['https://images.unsplash.com/photo-1749048575579-c6f995615893?w=1200&q=80&auto=format&fit=crop']::text[], 4.5, 112, 58, NULL, ARRAY['Black', 'Stone']::text[], ARRAY['pouch', 'tech', 'organization']::text[], false, false, false),
(10, 'UM-HOM-701', 'Slate Desk Tray', 'Home', 29, NULL, 'A concrete-composite desk tray for mail, notebooks, and daily carry — heavy enough to stay put, small enough to disappear.', ARRAY['Concrete-composite construction', 'Felt base, scratch-safe', 'Two-compartment layout', '10.5 x 6 x 2 in']::text[], ARRAY['https://images.unsplash.com/photo-1567416880385-6158327d05d6?w=1200&q=80&auto=format&fit=crop']::text[], 4.4, 44, 71, NULL, ARRAY['Concrete Gray']::text[], ARRAY['desk', 'tray', 'home']::text[], false, false, false),
(11, 'UM-HOM-704', 'Frame Wall Shelf', 'Home', 58, NULL, 'A solid oak floating shelf with a hidden bracket mount — a clean surface for plants, books, or a speaker.', ARRAY['Solid oak, matte sealed finish', 'Hidden steel bracket, no visible hardware', 'Holds up to 20 lbs evenly loaded', '24 x 6 in']::text[], ARRAY['https://images.unsplash.com/photo-1567416880385-6158327d05d6?w=1200&q=80&auto=format&fit=crop']::text[], 4.7, 39, 26, NULL, ARRAY['Oak', 'Walnut']::text[], ARRAY['shelf', 'wood', 'home']::text[], false, false, false),
(12, 'UM-STR-321', 'Modular Drawer Bin', 'Storage', 19, NULL, 'A stackable drawer bin with a finger-pull front and label window — the building block of a properly organized closet.', ARRAY['Recycled PET construction', 'Stacks and interlocks on all sides', 'Removable label card included', '12 x 8 x 5 in']::text[], ARRAY['https://images.unsplash.com/photo-1583686298564-46fbffda0707?w=1200&q=80&auto=format&fit=crop']::text[], 4.2, 58, 84, NULL, ARRAY['Clear', 'Graphite']::text[], ARRAY['storage', 'bin', 'closet']::text[], false, false, false),
(13, 'UM-TRV-418', 'Transit Packing Cubes (Set of 3)', 'Travel', 44, NULL, 'Three compression packing cubes in graduated sizes, built from ripstop nylon with mesh tops so you can see what''s inside.', ARRAY['Ripstop nylon, mesh top panel', 'Dual zip compression', 'Set of 3: small, medium, large', 'Machine washable']::text[], ARRAY['https://images.unsplash.com/photo-1448582649076-3981753123b5?w=1200&q=80&auto=format&fit=crop']::text[], 4.6, 129, 45, 'Best Seller', ARRAY['Black', 'Navy']::text[], ARRAY['travel', 'packing', 'cubes']::text[], false, false, true),
(14, 'UM-TLS-611', 'Ratchet Driver Set', 'Tools', 54, NULL, 'A 24-bit ratcheting screwdriver set with a magnetic bit holder and a compact case that fits in a desk drawer.', ARRAY['24 S2 steel precision bits', 'Reversible ratchet mechanism', 'Magnetic bit tip', 'Compact hard case included']::text[], ARRAY['https://images.unsplash.com/photo-1756027583186-a04a19e4f6ce?w=1200&q=80&auto=format&fit=crop']::text[], 4.7, 91, 37, NULL, ARRAY['Black']::text[], ARRAY['tools', 'driver', 'workshop']::text[], false, false, false),
(15, 'UM-LGT-215', 'Beam Clip Light', 'Lighting', 26, NULL, 'A rechargeable clip-on light with a rotating head, built for headboards, bags, shelves, and anywhere else you need directed light.', ARRAY['USB-C rechargeable, 10hr runtime', '360° rotating clip mount', 'Three brightness settings', 'Aluminum housing']::text[], ARRAY['https://images.unsplash.com/photo-1605194004886-56d82f482d53?w=1200&q=80&auto=format&fit=crop']::text[], 4.3, 67, 52, NULL, ARRAY['Black', 'Silver']::text[], ARRAY['light', 'clip', 'portable']::text[], false, false, false),
(16, 'UM-LFS-801', 'Ceramic Pour-Over Set', 'Lifestyle', 46, NULL, 'A matte-glazed ceramic pour-over dripper and mug set, designed for a slower morning routine.', ARRAY['Stoneware ceramic, matte glaze', 'Fits standard #2 filters', '12oz companion mug included', 'Dishwasher safe']::text[], ARRAY['https://images.unsplash.com/photo-1657040111323-0aa59a7af59d?w=1200&q=80&auto=format&fit=crop']::text[], 4.8, 73, 29, 'New', ARRAY['Sand', 'Charcoal']::text[], ARRAY['coffee', 'ceramic', 'kitchen']::text[], false, true, false),
(17, 'UM-EDC-114', 'Field Notebook & Pen', 'Everyday Carry', 24, NULL, 'A pocket-sized dot-grid notebook paired with a machined aluminum pen, held together with an elastic closure band.', ARRAY['96-page dot-grid notebook, 100gsm paper', 'Machined aluminum pen, twist mechanism', 'Elastic closure with pen loop', 'Fits any back pocket']::text[], ARRAY['https://images.unsplash.com/photo-1605468424365-bac89e69cc4a?w=1200&q=80&auto=format&fit=crop']::text[], 4.6, 84, 66, NULL, ARRAY['Black', 'Sand']::text[], ARRAY['notebook', 'pen', 'everyday carry']::text[], false, false, false),
(18, 'UM-TCH-512', 'Anchor Wireless Charger', 'Tech Accessories', 39, NULL, 'A weighted 15W wireless charging puck with a non-slip top and a low-profile aluminum housing that stays put on any desk.', ARRAY['15W fast wireless charging', 'Weighted non-slip base', 'Case-friendly charging depth', 'USB-C cable included']::text[], ARRAY['https://images.unsplash.com/photo-1749048575579-c6f995615893?w=1200&q=80&auto=format&fit=crop']::text[], 4.4, 105, 48, NULL, ARRAY['Black', 'White']::text[], ARRAY['charger', 'wireless', 'desk']::text[], false, false, false),
(19, 'UM-STR-330', 'Canvas Utility Bin', 'Storage', 32, NULL, 'A waxed-canvas utility bin with leather handles — soft-sided storage that still holds its shape on a shelf or floor.', ARRAY['Waxed canvas exterior', 'Reinforced base board', 'Full-grain leather handles', '14 x 10 x 10 in']::text[], ARRAY['https://images.unsplash.com/photo-1583686298564-46fbffda0707?w=1200&q=80&auto=format&fit=crop']::text[], 4.5, 36, 33, NULL, ARRAY['Olive', 'Charcoal']::text[], ARRAY['storage', 'canvas', 'bin']::text[], false, false, false),
(20, 'UM-TRV-425', 'Sling Travel Duffel', 'Travel', 98, 118, 'A 32L weekender duffel with a rigid base, a detachable strap, and a separate shoe compartment for quick trips.', ARRAY['1000D water-resistant nylon', 'Rigid base, self-standing', 'Ventilated shoe compartment', 'Fits under most airline seats']::text[], ARRAY['https://images.unsplash.com/photo-1448582649076-3981753123b5?w=1200&q=80&auto=format&fit=crop']::text[], 4.7, 142, 21, NULL, ARRAY['Black', 'Olive']::text[], ARRAY['duffel', 'travel', 'weekender']::text[], true, false, false),
(21, 'UM-TLS-628', 'Torque Compact Wrench', 'Tools', 41, NULL, 'A pocket-sized adjustable wrench with a smooth worm-gear mechanism and laser-etched measurement markings.', ARRAY['Chrome vanadium steel', '0–25mm adjustable jaw', 'Laser-etched scale', 'Belt-clip case included']::text[], ARRAY['https://images.unsplash.com/photo-1756027583186-a04a19e4f6ce?w=1200&q=80&auto=format&fit=crop']::text[], 4.5, 48, 40, NULL, ARRAY['Steel']::text[], ARRAY['wrench', 'tools', 'workshop']::text[], false, false, false),
(22, 'UM-LGT-222', 'Halo Ambient Light', 'Lighting', 68, NULL, 'A ring-shaped ambient light with app-free touch dimming — soft, indirect light for evenings that doesn''t compete with a lamp.', ARRAY['Diffused silicone ring, 10in diameter', 'Touch-dim base, no app required', 'Warm 2700K fixed color temperature', 'Wall or shelf mountable']::text[], ARRAY['https://images.unsplash.com/photo-1605194004886-56d82f482d53?w=1200&q=80&auto=format&fit=crop']::text[], 4.6, 57, 24, NULL, ARRAY['White', 'Black']::text[], ARRAY['ambient', 'light', 'home']::text[], false, false, false),
(23, 'UM-LFS-808', 'Wool Throw Blanket', 'Lifestyle', 89, NULL, 'A midweight recycled-wool throw in a subtle houndstooth weave, finished with a whipstitched edge.', ARRAY['60% recycled wool, 40% cotton blend', 'Whipstitched edge finish', '50 x 70 in', 'Dry clean recommended']::text[], ARRAY['https://images.unsplash.com/photo-1600369672770-985fd30004eb?w=1200&q=80&auto=format&fit=crop']::text[], 4.8, 61, 19, NULL, ARRAY['Charcoal Houndstooth', 'Oat']::text[], ARRAY['blanket', 'wool', 'home']::text[], false, false, false),
(24, 'UM-EDC-121', 'Anchor Key Rack', 'Everyday Carry', 27, NULL, 'A walnut-and-brass wall rack with five hooks and a slim shelf for keys, mail, and whatever you carry through the door.', ARRAY['Solid walnut base', 'Solid brass hooks, five total', 'Slim top shelf for mail or sunglasses', 'Concealed wall mount']::text[], ARRAY['https://images.unsplash.com/photo-1594299447935-e5b840f54b9b?w=1200&q=80&auto=format&fit=crop']::text[], 4.5, 33, 45, NULL, ARRAY['Walnut']::text[], ARRAY['entryway', 'keys', 'home']::text[], false, false, false),
(25, 'UM-TCH-519', 'Trace Laptop Stand', 'Tech Accessories', 52, NULL, 'A collapsible aluminum laptop stand that folds flat for a bag, and raises your screen to eye level everywhere else.', ARRAY['Aircraft-grade aluminum', 'Folds to 0.6 in thick', 'Fits 11–16 in laptops', 'Silicone grip pads']::text[], ARRAY['https://images.unsplash.com/photo-1749048575579-c6f995615893?w=1200&q=80&auto=format&fit=crop']::text[], 4.7, 96, 42, NULL, ARRAY['Silver', 'Space Gray']::text[], ARRAY['laptop', 'stand', 'desk']::text[], false, false, false),
(26, 'UM-STR-338', 'Locker Storage Trunk', 'Storage', 118, 140, 'A steel-frame storage trunk with a plywood core — doubles as a bench, coffee table, or off-season gear locker.', ARRAY['Powder-coated steel frame', 'Birch plywood panels', 'Reinforced corner brackets', '30 x 16 x 16 in']::text[], ARRAY['https://images.unsplash.com/photo-1583686298564-46fbffda0707?w=1200&q=80&auto=format&fit=crop']::text[], 4.6, 27, 12, 'Limited', ARRAY['Graphite', 'Olive']::text[], ARRAY['trunk', 'storage', 'furniture']::text[], false, false, false)
on conflict (id) do nothing;
---