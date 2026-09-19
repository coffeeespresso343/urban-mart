-- Run after schema.sql, schema-admin.sql, and schema-admin-storage.sql.
-- Hero slides are their own editorial layer on top of a product, not a
-- boolean flag on products — each slide has its own marketing copy, so a
-- product's "hero campaign" can be swapped without touching the product
-- record, and the same product could theoretically get a different hero
-- treatment later without losing history of the old one.

create table if not exists public.hero_slides (
  id uuid primary key default gen_random_uuid(),
  product_id integer not null references public.products (id) on delete cascade,
  tagline text not null,
  title text not null,
  highlight_text text not null,
  description text not null,
  image text not null,   -- one of the product's own uploaded image URLs
  thumb text not null,   -- also one of the product's own image URLs
  accent_color text not null default '#3b82f6',
  position integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists hero_slides_position_idx on public.hero_slides (position);

alter table public.hero_slides enable row level security;

create policy "Anyone can view active hero slides"
  on public.hero_slides for select
  using (is_active = true);

-- Admins additionally see inactive/draft slides (needed for the admin
-- list view, which shows everything, not just what's live).
create policy "Admins can view all hero slides"
  on public.hero_slides for select
  using (public.has_role(auth.uid(), 'admin'));

create policy "Admins can insert hero slides"
  on public.hero_slides for insert
  with check (public.has_role(auth.uid(), 'admin'));

create policy "Admins can update hero slides"
  on public.hero_slides for update
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

create policy "Admins can delete hero slides"
  on public.hero_slides for delete
  using (public.has_role(auth.uid(), 'admin'));

-- Reuses set_updated_at() from schema-admin.sql.
drop trigger if exists set_hero_slides_updated_at on public.hero_slides;
create trigger set_hero_slides_updated_at
  before update on public.hero_slides
  for each row execute procedure public.set_updated_at();

-- Caps active slides at 4 (the storefront hero only ever shows 3-4).
-- Enforced here, not just in the admin UI, since RLS/API access could
-- otherwise bypass a client-side-only limit.
create or replace function public.enforce_hero_slide_limit()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if new.is_active = true and (
    select count(*) from public.hero_slides
    where is_active = true
      and id <> coalesce(new.id, '00000000-0000-0000-0000-000000000000'::uuid)
  ) >= 4 then
    raise exception 'Maximum of 4 active hero slides allowed — deactivate one first.';
  end if;
  return new;
end;
$$;

drop trigger if exists check_hero_slide_limit on public.hero_slides;
create trigger check_hero_slide_limit
  before insert or update on public.hero_slides
  for each row execute procedure public.enforce_hero_slide_limit();