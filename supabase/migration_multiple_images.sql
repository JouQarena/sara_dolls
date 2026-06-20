-- ============================================================================
-- 🌸 SARA DOLLS — Migration: ensure multiple product images support
-- Run in Supabase → SQL Editor ONLY IF your products table doesn't already
-- have images_gallery as a TEXT[] array.
--
-- In the original schema.sql, images_gallery is already:
--     images_gallery  text[] not null default '{}'
-- so this migration is usually a NO-OP. It's safe to run regardless.
-- ============================================================================

-- 1) Make sure the column exists.
alter table public.products
  add column if not exists images_gallery text[] not null default '{}';

-- 2) If it somehow exists as a different type (e.g. jsonb), convert to text[].
--    (Uncomment ONLY if you get a type error — adjust as needed.)
-- alter table public.products
--   alter column images_gallery type text[] using
--   case
--     when images_gallery is null then '{}'::text[]
--     else translate(images_gallery::text, '[]', '{}')::text[]
--   end;

-- Done.
