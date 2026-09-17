-- ============================================================================
-- 🌸 SARA DOLLS — Add gender to profiles (male/female speech)
-- Run in Supabase → SQL Editor → New query → Run.
-- Safe to run multiple times.
--
-- The site addresses visitors in feminine or masculine Arabic depending on
-- their gender: chosen at signup, changeable in profile, or via the
-- 👩/👨 toggle (saved in a cookie) for guests.
-- Existing accounts get NULL = treated as feminine (brand default).
-- ============================================================================

-- 1) Add the column -------------------------------------------------------
alter table public.profiles
  add column if not exists gender text check (gender in ('male', 'female'));

-- 2) Copy gender from signup metadata for NEW users ------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, phone_number, gender)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'phone_number', ''),
    coalesce(new.raw_user_meta_data->>'gender', 'female')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Done. New signups will store gender; old rows stay NULL (= feminine).
-- ============================================================================
