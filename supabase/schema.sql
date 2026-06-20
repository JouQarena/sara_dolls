-- ============================================================================
-- 🌸 SARA DOLLS — Full Database Schema (Phase 1)
-- Run this entire file in: Supabase Dashboard → SQL Editor → New query → Run
-- Safe to re-run: uses IF NOT EXISTS / CREATE OR REPLACE / ON CONFLICT.
-- Target market: Egypt | Currency: EGP
-- ============================================================================

-- Useful extensions ---------------------------------------------------------
create extension if not exists "pgcrypto";   -- gen_random_uuid()

-- ============================================================================
-- HELPER: is_admin()  — checks the logged-in user's email against admin list.
-- Update the email(s) below to YOUR admin email (must match ADMIN_EMAIL env).
-- ============================================================================
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from auth.users u
    where u.id = auth.uid()
      and lower(u.email) = any (array[
        'admin@saradolls.com'   -- 👈 CHANGE THIS to your real admin email
      ])
  );
$$;

-- ============================================================================
-- 1) PROFILES  (1:1 with auth.users)
-- ============================================================================
create table if not exists public.profiles (
  id                  uuid primary key references auth.users(id) on delete cascade,
  full_name           text,
  phone_number        text,
  default_governorate text,
  default_city        text,
  default_address     text,
  created_at          timestamptz not null default now()
);

-- Auto-create a profile row whenever a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, phone_number)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'phone_number', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================================
-- 2) CATEGORIES
-- ============================================================================
create table if not exists public.categories (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,
  name_ar        text not null,
  slug           text not null unique,
  image_url      text,
  description_ar text,
  is_special     boolean not null default false,
  sort_order     int not null default 0,
  created_at     timestamptz not null default now()
);

-- ============================================================================
-- 3) PRODUCTS
-- ============================================================================
create table if not exists public.products (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  name_ar         text not null,
  slug            text not null unique,
  description     text,
  description_ar  text,
  price           numeric(10,2) not null default 0,      -- EGP
  original_price  numeric(10,2),                          -- for showing discounts
  stock           int not null default 0,
  category_id     uuid references public.categories(id) on delete set null,
  image_url       text,
  images_gallery  text[] not null default '{}',
  product_type    text not null default 'physical'
                    check (product_type in ('physical','pattern_pdf')),
  pdf_url         text,                                   -- patterns only
  is_available    boolean not null default true,
  is_featured     boolean not null default false,
  average_rating  numeric(2,1) not null default 0,
  review_count    int not null default 0,
  created_at      timestamptz not null default now()
);
create index if not exists products_category_idx on public.products(category_id);
create index if not exists products_featured_idx on public.products(is_featured);

-- ============================================================================
-- 4) REVIEWS
-- ============================================================================
create table if not exists public.reviews (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null references public.products(id) on delete cascade,
  user_id     uuid not null references auth.users(id) on delete cascade,
  rating      int not null check (rating between 1 and 5),
  comment     text,
  created_at  timestamptz not null default now(),
  unique (product_id, user_id)
);
create index if not exists reviews_product_idx on public.reviews(product_id);

-- Keep products.average_rating / review_count in sync with reviews.
create or replace function public.refresh_product_rating()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  pid uuid := coalesce(new.product_id, old.product_id);
begin
  update public.products p
  set average_rating = coalesce((select round(avg(rating)::numeric, 1) from public.reviews where product_id = pid), 0),
      review_count   = coalesce((select count(*) from public.reviews where product_id = pid), 0)
  where p.id = pid;
  return null;
end;
$$;

drop trigger if exists trg_reviews_aiud on public.reviews;
create trigger trg_reviews_aiud
  after insert or update or delete on public.reviews
  for each row execute function public.refresh_product_rating();

-- ============================================================================
-- 5) WISHLIST
-- ============================================================================
create table if not exists public.wishlist (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  product_id  uuid not null references public.products(id) on delete cascade,
  created_at  timestamptz not null default now(),
  unique (user_id, product_id)
);

-- ============================================================================
-- 6) DISCOUNT CODES
-- ============================================================================
create table if not exists public.discount_codes (
  id               uuid primary key default gen_random_uuid(),
  code             text not null unique,
  discount_type    text not null check (discount_type in ('percentage','fixed')),
  discount_value   numeric(10,2) not null,
  min_order_amount numeric(10,2) not null default 0,
  max_uses         int,
  used_count       int not null default 0,
  expires_at       timestamptz,
  is_active        boolean not null default true,
  created_at       timestamptz not null default now()
);

-- ============================================================================
-- 7) ORDERS
-- ============================================================================
create table if not exists public.orders (
  id                      uuid primary key default gen_random_uuid(),
  order_number            bigint generated by default as identity,  -- human-friendly #
  user_id                 uuid references auth.users(id) on delete set null,
  full_name               text not null,
  phone_number            text not null,
  governorate             text not null,
  city                    text,
  address                 text not null,
  payment_method          text not null
                            check (payment_method in ('cash_on_delivery','instapay')),
  instapay_screenshot_url text,
  discount_code           text,
  discount_amount         numeric(10,2) not null default 0,
  subtotal                numeric(10,2) not null default 0,
  shipping_fee            numeric(10,2) not null default 0,
  total_price             numeric(10,2) not null default 0,
  status                  text not null default 'pending'
                            check (status in ('pending','confirmed','processing','shipped','delivered','cancelled')),
  cancellation_reason     text,
  notes                   text,
  agreed_to_terms         boolean not null default false,
  created_at              timestamptz not null default now()
);
create index if not exists orders_user_idx on public.orders(user_id);
create index if not exists orders_status_idx on public.orders(status);

-- ============================================================================
-- 8) ORDER ITEMS
-- ============================================================================
create table if not exists public.order_items (
  id                uuid primary key default gen_random_uuid(),
  order_id          uuid not null references public.orders(id) on delete cascade,
  product_id        uuid references public.products(id) on delete set null,
  product_name_ar   text,            -- snapshot in case product is later deleted
  quantity          int not null default 1,
  price_at_purchase numeric(10,2) not null default 0
);
create index if not exists order_items_order_idx on public.order_items(order_id);

-- ============================================================================
-- 9) CUSTOM ORDERS  ⭐ (the special feature)
-- ============================================================================
create table if not exists public.custom_orders (
  id                 uuid primary key default gen_random_uuid(),
  order_number       bigint generated by default as identity,
  user_id            uuid references auth.users(id) on delete set null,
  full_name          text not null,
  phone_number       text not null,
  email              text,
  governorate        text,
  city               text,
  address            text,
  order_type         text not null
                       check (order_type in ('doll','gift','character','other')),
  description        text not null,
  preferred_colors   text,
  size               text,
  reference_images   text[] not null default '{}',
  budget_range       text,
  deadline           date,
  additional_notes   text,
  status             text not null default 'pending_review'
                       check (status in ('pending_review','quoted','approved','in_progress','completed','delivered','cancelled')),
  admin_quote_price  numeric(10,2),
  admin_notes        text,
  agreed_to_terms    boolean not null default false,
  created_at         timestamptz not null default now()
);
create index if not exists custom_orders_user_idx on public.custom_orders(user_id);
create index if not exists custom_orders_status_idx on public.custom_orders(status);

-- ============================================================================
-- 10) NEWSLETTER SUBSCRIBERS
-- ============================================================================
create table if not exists public.newsletter_subscribers (
  id         uuid primary key default gen_random_uuid(),
  email      text not null unique,
  created_at timestamptz not null default now()
);

-- ============================================================================
-- 11) CONTACT MESSAGES
-- ============================================================================
create table if not exists public.contact_messages (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text,
  phone      text,
  message    text not null,
  is_read    boolean not null default false,
  created_at timestamptz not null default now()
);

-- ============================================================================
-- 12) SITE SETTINGS  (single row, id = 1)
-- ============================================================================
create table if not exists public.site_settings (
  id                      int primary key default 1,
  store_name              text not null default 'Sara Dolls',
  store_name_ar           text not null default 'سارة دولز',
  whatsapp_number         text,
  instapay_number         text,
  instagram_url           text,
  facebook_url            text,
  tiktok_url              text,
  flat_shipping_fee       numeric(10,2) not null default 50,
  free_shipping_threshold numeric(10,2) not null default 1000,
  hero_title_ar           text default 'دمى كروشيه دافئة تروي حكايات مصنوعة بحب',
  hero_subtitle_ar        text default 'كل دمية من سارة دولز منسوجة يدويًا بكل حب لتكون رفيقة العمر وهدية لا تُنسى.',
  hero_image_url          text,
  announcement_bar_text   text default '🌸 شحن مجاني داخل مصر للطلبات فوق 1000 ج.م — تسوقي الآن!',
  custom_order_intro_ar   text default 'عندك فكرة معينة في بالك؟ شخصية محببة؟ هدية مميزة؟ احكيلنا وهنصنعها مخصوص لك بإيدينا.',
  updated_at              timestamptz not null default now(),
  constraint single_row check (id = 1)
);

-- ============================================================================
-- RPC: atomically increment a discount code's used_count (called at checkout)
-- ============================================================================
create or replace function public.increment_discount_use(p_code text)
returns void
language sql
security definer
set search_path = public
as $$
  update public.discount_codes
  set used_count = used_count + 1
  where code = p_code;
$$;

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================
alter table public.profiles               enable row level security;
alter table public.categories             enable row level security;
alter table public.products               enable row level security;
alter table public.reviews                enable row level security;
alter table public.wishlist               enable row level security;
alter table public.discount_codes         enable row level security;
alter table public.orders                 enable row level security;
alter table public.order_items            enable row level security;
alter table public.custom_orders          enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.contact_messages       enable row level security;
alter table public.site_settings          enable row level security;

-- ---- PROFILES ----
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id or public.is_admin());
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);
drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

-- ---- CATEGORIES (public read, admin write) ----
drop policy if exists "categories_read_all" on public.categories;
create policy "categories_read_all" on public.categories
  for select using (true);
drop policy if exists "categories_admin_write" on public.categories;
create policy "categories_admin_write" on public.categories
  for all using (public.is_admin()) with check (public.is_admin());

-- ---- PRODUCTS (public read, admin write) ----
drop policy if exists "products_read_all" on public.products;
create policy "products_read_all" on public.products
  for select using (true);
drop policy if exists "products_admin_write" on public.products;
create policy "products_admin_write" on public.products
  for all using (public.is_admin()) with check (public.is_admin());

-- ---- REVIEWS (public read; user manages own; admin manages all) ----
drop policy if exists "reviews_read_all" on public.reviews;
create policy "reviews_read_all" on public.reviews
  for select using (true);
drop policy if exists "reviews_insert_own" on public.reviews;
create policy "reviews_insert_own" on public.reviews
  for insert with check (auth.uid() = user_id);
drop policy if exists "reviews_update_own" on public.reviews;
create policy "reviews_update_own" on public.reviews
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "reviews_delete_own_or_admin" on public.reviews;
create policy "reviews_delete_own_or_admin" on public.reviews
  for delete using (auth.uid() = user_id or public.is_admin());

-- ---- WISHLIST (user owns rows) ----
drop policy if exists "wishlist_select_own" on public.wishlist;
create policy "wishlist_select_own" on public.wishlist
  for select using (auth.uid() = user_id);
drop policy if exists "wishlist_insert_own" on public.wishlist;
create policy "wishlist_insert_own" on public.wishlist
  for insert with check (auth.uid() = user_id);
drop policy if exists "wishlist_delete_own" on public.wishlist;
create policy "wishlist_delete_own" on public.wishlist
  for delete using (auth.uid() = user_id);

-- ---- DISCOUNT CODES (admin manage; read handled server-side in checkout) ----
drop policy if exists "discount_admin_all" on public.discount_codes;
create policy "discount_admin_all" on public.discount_codes
  for all using (public.is_admin()) with check (public.is_admin());
-- Allow authenticated/anon to read only ACTIVE codes (validation at checkout).
drop policy if exists "discount_read_active" on public.discount_codes;
create policy "discount_read_active" on public.discount_codes
  for select using (is_active = true);

-- ---- ORDERS (user sees own; admin sees all; guests can create) ----
drop policy if exists "orders_select_own_or_admin" on public.orders;
create policy "orders_select_own_or_admin" on public.orders
  for select using (auth.uid() = user_id or public.is_admin());
drop policy if exists "orders_insert_any" on public.orders;
create policy "orders_insert_any" on public.orders
  for insert with check (true);  -- guest checkout allowed
drop policy if exists "orders_update_own_or_admin" on public.orders;
create policy "orders_update_own_or_admin" on public.orders
  for update using (auth.uid() = user_id or public.is_admin())
  with check (auth.uid() = user_id or public.is_admin());

-- ---- ORDER ITEMS (linked to orders) ----
drop policy if exists "order_items_select" on public.order_items;
create policy "order_items_select" on public.order_items
  for select using (
    public.is_admin() or exists (
      select 1 from public.orders o
      where o.id = order_items.order_id and o.user_id = auth.uid()
    )
  );
drop policy if exists "order_items_insert" on public.order_items;
create policy "order_items_insert" on public.order_items
  for insert with check (true);

-- ---- CUSTOM ORDERS (user sees own; admin sees/updates all; guests create) ----
drop policy if exists "custom_select_own_or_admin" on public.custom_orders;
create policy "custom_select_own_or_admin" on public.custom_orders
  for select using (auth.uid() = user_id or public.is_admin());
drop policy if exists "custom_insert_any" on public.custom_orders;
create policy "custom_insert_any" on public.custom_orders
  for insert with check (true);
drop policy if exists "custom_update_own_or_admin" on public.custom_orders;
create policy "custom_update_own_or_admin" on public.custom_orders
  for update using (auth.uid() = user_id or public.is_admin())
  with check (auth.uid() = user_id or public.is_admin());

-- ---- NEWSLETTER (anyone can subscribe; admin reads) ----
drop policy if exists "newsletter_insert_any" on public.newsletter_subscribers;
create policy "newsletter_insert_any" on public.newsletter_subscribers
  for insert with check (true);
drop policy if exists "newsletter_admin_read" on public.newsletter_subscribers;
create policy "newsletter_admin_read" on public.newsletter_subscribers
  for select using (public.is_admin());
drop policy if exists "newsletter_admin_delete" on public.newsletter_subscribers;
create policy "newsletter_admin_delete" on public.newsletter_subscribers
  for delete using (public.is_admin());

-- ---- CONTACT MESSAGES (anyone can send; admin reads/updates) ----
drop policy if exists "contact_insert_any" on public.contact_messages;
create policy "contact_insert_any" on public.contact_messages
  for insert with check (true);
drop policy if exists "contact_admin_read" on public.contact_messages;
create policy "contact_admin_read" on public.contact_messages
  for select using (public.is_admin());
drop policy if exists "contact_admin_update" on public.contact_messages;
create policy "contact_admin_update" on public.contact_messages
  for update using (public.is_admin()) with check (public.is_admin());

-- ---- SITE SETTINGS (public read, admin write) ----
drop policy if exists "settings_read_all" on public.site_settings;
create policy "settings_read_all" on public.site_settings
  for select using (true);
drop policy if exists "settings_admin_write" on public.site_settings;
create policy "settings_admin_write" on public.site_settings
  for all using (public.is_admin()) with check (public.is_admin());

-- ============================================================================
-- SEED DATA
-- ============================================================================

-- The 5 categories.
insert into public.categories (name, name_ar, slug, description_ar, is_special, sort_order) values
  ('Dolls',            'الدمى',         'dolls',       'دمى كروشيه مصنوعة يدويًا بأحجام وشخصيات مختلفة', false, 1),
  ('Patterns',         'الباترونات',    'patterns',    'باترونات كروشيه جاهزة (PDF أو مطبوعة) لمحبي الصنع اليدوي', false, 2),
  ('Gifts for Adults', 'هدايا للكبار',  'adult-gifts', 'هدايا كروشيه مثالية للكبار', false, 3),
  ('Gifts for Kids',   'هدايا للأطفال', 'kids-gifts',  'هدايا كروشيه لطيفة وآمنة للأطفال', false, 4),
  ('Custom Orders',    'طلبات خاصة',    'custom',      'طلبات يدوية مخصصة تُصنع خصيصًا لك', true,  5)
on conflict (slug) do update
  set name = excluded.name,
      name_ar = excluded.name_ar,
      description_ar = excluded.description_ar,
      is_special = excluded.is_special,
      sort_order = excluded.sort_order;

-- Default site settings (single row).
insert into public.site_settings (id) values (1)
on conflict (id) do nothing;

-- ============================================================================
-- DONE. Next: run supabase/storage.sql to create the 3 storage buckets.
-- ============================================================================
