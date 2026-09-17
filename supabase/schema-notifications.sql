-- Run after schema.sql and schema-admin.sql.
-- Notifications are broadcast to ALL admins (one row per event), with a
-- separate per-admin read-tracking table — so "read" state doesn't
-- require N copies of the same notification.

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('new_order', 'new_signup', 'low_stock', 'user_blocked')),
  title text not null,
  body text not null,
  link text,
  created_at timestamptz not null default now()
);

alter table public.notifications enable row level security;

create policy "Admins can view notifications"
  on public.notifications for select
  using (public.has_role(auth.uid(), 'admin'));

-- No insert/update/delete policy for regular clients — every row is
-- written by the SECURITY DEFINER trigger functions below, which run
-- with the function owner's privileges and bypass RLS, the same pattern
-- schema.sql already uses for handle_new_user() writing into profiles.

create table if not exists public.notification_reads (
  notification_id uuid not null references public.notifications (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  read_at timestamptz not null default now(),
  primary key (notification_id, user_id)
);

alter table public.notification_reads enable row level security;

create policy "Admins can view their own read state"
  on public.notification_reads for select
  using (auth.uid() = user_id);

create policy "Admins can mark notifications read"
  on public.notification_reads for insert
  with check (auth.uid() = user_id and public.has_role(auth.uid(), 'admin'));

-- ---------------------------------------------------------------------
-- Trigger: new order
-- ---------------------------------------------------------------------
create or replace function public.notify_new_order()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.notifications (type, title, body, link)
  values (
    'new_order',
    'New order #' || new.order_number,
    '$' || new.total || ' · ' || jsonb_array_length(new.items) || ' item(s)',
    '/admin/orders'
  );
  return new;
end;
$$;

drop trigger if exists on_order_created on public.orders;
create trigger on_order_created
  after insert on public.orders
  for each row execute procedure public.notify_new_order();

-- ---------------------------------------------------------------------
-- Trigger: new signup (profiles row is created right after auth.users,
-- via the existing handle_new_user() trigger from schema.sql)
-- ---------------------------------------------------------------------
create or replace function public.notify_new_signup()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.notifications (type, title, body, link)
  values (
    'new_signup',
    'New signup',
    coalesce(new.email, 'A new user') || ' joined',
    '/admin/users/' || new.id
  );
  return new;
end;
$$;

drop trigger if exists on_profile_created_notify on public.profiles;
create trigger on_profile_created_notify
  after insert on public.profiles
  for each row execute procedure public.notify_new_signup();

-- ---------------------------------------------------------------------
-- Trigger: low stock — fires when stock crosses down to <= 5, not on
-- every update while it stays low (avoids a flood of duplicate alerts).
-- ---------------------------------------------------------------------
create or replace function public.notify_low_stock()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if new.stock <= 5 and (tg_op = 'INSERT' or old.stock > 5) then
    insert into public.notifications (type, title, body, link)
    values (
      'low_stock',
      'Low stock: ' || new.name,
      case when new.stock = 0 then 'Out of stock' else new.stock || ' left' end,
      '/admin/products'
    );
  end if;
  return new;
end;
$$;

drop trigger if exists on_product_stock_change on public.products;
create trigger on_product_stock_change
  after insert or update on public.products
  for each row execute procedure public.notify_low_stock();

-- ---------------------------------------------------------------------
-- Trigger: user blocked — fires only on the false→true transition.
-- ---------------------------------------------------------------------
create or replace function public.notify_user_blocked()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if new.is_blocked = true and coalesce(old.is_blocked, false) = false then
    insert into public.notifications (type, title, body, link)
    values (
      'user_blocked',
      'User blocked',
      coalesce(new.email, 'A user') || ' was blocked',
      '/admin/users/' || new.id
    );
  end if;
  return new;
end;
$$;

drop trigger if exists on_profile_blocked_notify on public.profiles;
create trigger on_profile_blocked_notify
  after update on public.profiles
  for each row execute procedure public.notify_user_blocked();

-- ---------------------------------------------------------------------
-- Enable Realtime on notifications so the admin bell updates instantly.
-- If this errors ("already a member" or similar), it's likely already
-- enabled — check Dashboard → Database → Replication as a fallback.
-- ---------------------------------------------------------------------
alter publication supabase_realtime add table public.notifications;