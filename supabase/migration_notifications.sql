-- ============================================================================
-- 🔔 SARA DOLLS — Admin notifications (new orders bell + page)
-- Run in Supabase → SQL Editor → New query → Run.
-- Safe to run multiple times.
--
-- Stores one row per new regular/custom order. Shown in:
--   - the 🔔 bell in /admin (auto-refreshes every 30s + optional sound)
--   - the full list at /admin/notifications
-- Only the admin can read/write (server uses the service-role key).
-- ============================================================================

create table if not exists public.notifications (
  id          uuid primary key default gen_random_uuid(),
  type        text not null check (type in ('new_order', 'new_custom_order')),
  title_ar    text not null,
  body_ar     text,
  link        text not null default '/admin',
  ref_id      uuid,
  ref_number  bigint,
  is_read     boolean not null default false,
  created_at  timestamptz not null default now()
);

create index if not exists notifications_read_idx
  on public.notifications (is_read, created_at desc);

alter table public.notifications enable row level security;

drop policy if exists "notifications_admin_all" on public.notifications;
create policy "notifications_admin_all" on public.notifications
  for all using (public.is_admin()) with check (public.is_admin());

-- Done. New orders will now appear in the admin 🔔 bell.
-- ============================================================================
