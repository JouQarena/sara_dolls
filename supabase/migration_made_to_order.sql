-- ============================================================================
-- 🧶 SARA DOLLS — Made-to-order products (no stock, no new category)
-- Run in Supabase → SQL Editor → New query → Run.
-- Safe to run multiple times.
--
-- Adds a 3rd product_type value 'made_to_order' (beside physical/pattern_pdf):
--   - sold in any existing category, unlimited quantity, never out of stock
--   - lead_time_days: optional prep time shown to customers (e.g. 10 days)
-- Existing products are NOT affected.
-- ============================================================================

-- 1) Widen the product_type check (drop any old check on that column first) --
do $$
declare r record;
begin
  for r in
    select con.conname
    from pg_constraint con
    join pg_attribute att on att.attrelid = con.conrelid and att.attnum = any(con.conkey)
    where con.conrelid = 'public.products'::regclass
      and con.contype = 'c'
      and att.attname = 'product_type'
  loop
    execute format('alter table public.products drop constraint %I', r.conname);
  end loop;
end $$;

alter table public.products
  add constraint products_product_type_check
  check (product_type in ('physical', 'pattern_pdf', 'made_to_order'));

-- 2) Optional prep-time in days -------------------------------------------
alter table public.products
  add column if not exists lead_time_days int
  check (lead_time_days is null or lead_time_days >= 0);

-- Done. In /admin → المنتجات, product type now offers "يُصنع عند الطلب 🧶".
-- ============================================================================
