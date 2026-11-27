-- HeuriLab Supabase Database Schema & Row Level Security (RLS)
-- Jalankan script ini di Supabase SQL Editor sebelum menghubungkan frontend.
-- Catatan keamanan:
-- 1. Hanya gunakan VITE_SUPABASE_ANON_KEY di sisi client.
-- 2. Operasi DELETE diblokir untuk role anon sehingga penghapusan data
--    hanya dapat dilakukan secara manual oleh admin lewat Supabase Table Editor.

create extension if not exists pgcrypto;

-- 1. Tabel users (profil tamu minimal tanpa PII sensitif)
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  name text not null check (
    char_length(trim(name)) between 1 and 25
    and name !~ '[<>]'
  ),
  total_score integer not null default 0 check (total_score >= 0),
  badges jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

-- 2. Tabel mission_logs (riwayat percobaan & penyelesaian misi)
create table if not exists public.mission_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  heuristic_code text not null check (char_length(trim(heuristic_code)) between 1 and 20),
  is_correct boolean not null default false,
  attempts integer not null default 1 check (attempts >= 1),
  time_spent_seconds integer not null default 0 check (time_spent_seconds >= 0),
  created_at timestamptz not null default now()
);

-- Indeks performa untuk leaderboard & riwayat misi
create index if not exists idx_users_total_score_desc
  on public.users (total_score desc, created_at asc);

create index if not exists idx_mission_logs_user_id
  on public.mission_logs (user_id, created_at desc);

-- Aktifkan Row Level Security (RLS)
alter table public.users enable row level security;
alter table public.mission_logs enable row level security;

-- Bersihkan policy lama jika script dijalankan ulang
drop policy if exists "anon_select_users" on public.users;
drop policy if exists "anon_insert_users" on public.users;
drop policy if exists "anon_update_users" on public.users;

drop policy if exists "anon_select_mission_logs" on public.mission_logs;
drop policy if exists "anon_insert_mission_logs" on public.mission_logs;
drop policy if exists "anon_update_mission_logs" on public.mission_logs;

-- Pastikan hak akses tabel eksplisit untuk anon & blokir DELETE dari API publik
revoke all on public.users from anon;
revoke all on public.mission_logs from anon;
grant select, insert, update on public.users to anon;
grant select, insert, update on public.mission_logs to anon;
revoke delete on public.users, public.mission_logs from anon;

-- Policy RLS tabel users untuk role anon (SELECT, INSERT, UPDATE diizinkan; DELETE diblokir)
create policy "anon_select_users"
  on public.users
  for select
  to anon
  using (true);

create policy "anon_insert_users"
  on public.users
  for insert
  to anon
  with check (
    char_length(trim(name)) between 1 and 25
    and name !~ '[<>]'
    and total_score >= 0
    and jsonb_typeof(badges) = 'array'
  );

create policy "anon_update_users"
  on public.users
  for update
  to anon
  using (true)
  with check (
    char_length(trim(name)) between 1 and 25
    and name !~ '[<>]'
    and total_score >= 0
    and jsonb_typeof(badges) = 'array'
  );

-- Policy RLS tabel mission_logs untuk role anon (SELECT, INSERT, UPDATE diizinkan; DELETE diblokir)
create policy "anon_select_mission_logs"
  on public.mission_logs
  for select
  to anon
  using (true);

create policy "anon_insert_mission_logs"
  on public.mission_logs
  for insert
  to anon
  with check (
    exists (
      select 1
      from public.users u
      where u.id = user_id
    )
    and char_length(trim(heuristic_code)) between 1 and 20
    and attempts >= 1
    and time_spent_seconds >= 0
  );

create policy "anon_update_mission_logs"
  on public.mission_logs
  for update
  to anon
  using (true)
  with check (
    attempts >= 1
    and time_spent_seconds >= 0
  );
