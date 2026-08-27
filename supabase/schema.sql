-- Urban-Mart Supabase schema
-- Run this in the Supabase SQL Editor for your project.
-- Auth (sign up / sign in / magic link) is handled by Supabase's built-in
-- auth.users table — this file only adds the app-specific tables that sit
-- on top of it: profiles, saved addresses, and orders.

-- ---------------------------------------------------------------------
-- profiles: one row per authenticated user, extends auth.users
-- ---------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  first_name text,
  last_name text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Automatically create a profile row whenever a new user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, first_name, last_name)
  values (
    new.id,
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------------------------------------------------------------------
-- addresses: saved shipping addresses per user
-- ---------------------------------------------------------------------
create table if not exists public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  first_name text not null,
  last_name text not null,
  phone text,
  address text not null,
  city text not null,
  postal_code text not null,
  country text not null,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.addresses enable row level security;

create policy "Users can manage their own addresses"
  on public.addresses for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------
-- orders: one row per placed order. user_id is nullable to support
-- guest checkout; guest orders are looked up by order_number + email
-- instead of by session, so no guest data is ever publicly listable.
-- ---------------------------------------------------------------------
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  user_id uuid references auth.users (id) on delete set null,
  email text not null,
  status text not null default 'processing'
    check (status in ('processing', 'shipped', 'delivered', 'cancelled')),
  items jsonb not null,
  subtotal numeric(10, 2) not null,
  shipping numeric(10, 2) not null default 0,
  discount numeric(10, 2) not null default 0,
  total numeric(10, 2) not null,
  shipping_address jsonb not null,
  shipping_method text not null,
  estimated_delivery date,
  created_at timestamptz not null default now()
);

alter table public.orders enable row level security;

-- Signed-in users can see their own order history.
create policy "Users can view their own orders"
  on public.orders for select
  using (auth.uid() = user_id);

-- Anyone (including guests, via the anon key) can create an order row.
-- NOTE before going fully live: pair this with a server-side function
-- (e.g. a Supabase Edge Function) that only inserts an order after a
-- successful Stripe payment webhook, rather than trusting the client to
-- insert directly — the same way the current checkout is a simulated
-- flow rather than a real payment integration.
create policy "Anyone can create an order"
  on public.orders for insert
  with check (auth.uid() = user_id or user_id is null);

-- Order lookup for guest checkout confirmation pages (by order_number,
-- scoped to the order's own email so guests can't enumerate others').
create policy "Guests can view their order by number"
  on public.orders for select
  using (user_id is null);

create index if not exists orders_user_id_idx on public.orders (user_id);
create index if not exists orders_order_number_idx on public.orders (order_number);
