-- ============================================================================
-- 🌸 SARA DOLLS — Storage Buckets (Phase 1)
-- Run AFTER schema.sql, in: Supabase Dashboard → SQL Editor → New query → Run
--
-- Creates 3 buckets:
--   1) products                  (public)  — product images & pattern PDFs
--   2) instapay-screenshots      (private) — payment proof uploads
--   3) custom-order-references    (public)  — customer reference images
--
-- NOTE: you can also create these manually in Dashboard → Storage.
-- ============================================================================

-- Create buckets (id == name). file_size_limit in bytes (10 MB).
insert into storage.buckets (id, name, public, file_size_limit)
values
  ('products',               'products',               true,  10485760),
  ('custom-order-references','custom-order-references',true,  10485760),
  ('instapay-screenshots',   'instapay-screenshots',   false, 10485760)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit;

-- ---------------------------------------------------------------------------
-- POLICIES
-- ---------------------------------------------------------------------------

-- PRODUCTS bucket: public read, admin write.
drop policy if exists "products_public_read" on storage.objects;
create policy "products_public_read" on storage.objects
  for select using (bucket_id = 'products');

drop policy if exists "products_admin_write" on storage.objects;
create policy "products_admin_write" on storage.objects
  for insert with check (bucket_id = 'products' and public.is_admin());

drop policy if exists "products_admin_update" on storage.objects;
create policy "products_admin_update" on storage.objects
  for update using (bucket_id = 'products' and public.is_admin());

drop policy if exists "products_admin_delete" on storage.objects;
create policy "products_admin_delete" on storage.objects
  for delete using (bucket_id = 'products' and public.is_admin());

-- CUSTOM-ORDER-REFERENCES bucket: public read, anyone can upload (guest custom orders).
drop policy if exists "customref_public_read" on storage.objects;
create policy "customref_public_read" on storage.objects
  for select using (bucket_id = 'custom-order-references');

drop policy if exists "customref_any_upload" on storage.objects;
create policy "customref_any_upload" on storage.objects
  for insert with check (bucket_id = 'custom-order-references');

drop policy if exists "customref_admin_delete" on storage.objects;
create policy "customref_admin_delete" on storage.objects
  for delete using (bucket_id = 'custom-order-references' and public.is_admin());

-- INSTAPAY-SCREENSHOTS bucket: anyone can upload (guest checkout), admin reads.
-- Private bucket — files are served to admin via signed URLs (Phase 8).
drop policy if exists "instapay_any_upload" on storage.objects;
create policy "instapay_any_upload" on storage.objects
  for insert with check (bucket_id = 'instapay-screenshots');

drop policy if exists "instapay_admin_read" on storage.objects;
create policy "instapay_admin_read" on storage.objects
  for select using (bucket_id = 'instapay-screenshots' and public.is_admin());

drop policy if exists "instapay_admin_delete" on storage.objects;
create policy "instapay_admin_delete" on storage.objects
  for delete using (bucket_id = 'instapay-screenshots' and public.is_admin());

-- ============================================================================
-- DONE. Storage is ready.
-- ============================================================================
