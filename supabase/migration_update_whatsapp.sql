-- ============================================================================
-- 🌸 SARA DOLLS — Update Sara's WhatsApp number
-- Run in Supabase → SQL Editor → New query → Run.
-- Safe to run multiple times.
-- Sara's number: 01109624671 → international: 201109624671
-- (Developer's number is separate and is NOT changed by this file.)
-- ============================================================================

insert into public.site_settings (id, whatsapp_number)
values (1, '201109624671')
on conflict (id) do update set whatsapp_number = excluded.whatsapp_number;

-- Verify:
-- select id, whatsapp_number from public.site_settings where id = 1;
