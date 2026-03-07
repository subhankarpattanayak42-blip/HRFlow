-- Run this in Supabase SQL Editor

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  role text not null check (role in ('student', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.teams (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  members text[] not null default '{}',
  session jsonb not null default '{}'::jsonb,
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.custom_scenarios (
  id uuid primary key default gen_random_uuid(),
  module text not null,
  title text not null,
  description text not null,
  options jsonb not null,
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.results (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.teams(id) on delete cascade,
  team_name text not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  user_email text,
  score int not null,
  label text not null,
  metrics jsonb not null,
  modules_played text[] not null default '{}',
  completed_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
  );
$$;

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists trg_teams_updated_at on public.teams;
create trigger trg_teams_updated_at
before update on public.teams
for each row execute function public.set_updated_at();

drop trigger if exists trg_custom_scenarios_updated_at on public.custom_scenarios;
create trigger trg_custom_scenarios_updated_at
before update on public.custom_scenarios
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.teams enable row level security;
alter table public.custom_scenarios enable row level security;
alter table public.results enable row level security;

drop policy if exists "profiles select own" on public.profiles;
drop policy if exists "profiles insert own" on public.profiles;
drop policy if exists "profiles update own" on public.profiles;
drop policy if exists "teams authenticated select" on public.teams;
drop policy if exists "teams authenticated insert" on public.teams;
drop policy if exists "teams authenticated update" on public.teams;
drop policy if exists "custom scenarios authenticated select" on public.custom_scenarios;
drop policy if exists "custom scenarios authenticated insert" on public.custom_scenarios;
drop policy if exists "custom scenarios authenticated update" on public.custom_scenarios;
drop policy if exists "custom scenarios admin delete" on public.custom_scenarios;
drop policy if exists "results authenticated select" on public.results;
drop policy if exists "results authenticated insert" on public.results;
drop policy if exists "results admin delete" on public.results;
drop policy if exists "teams admin delete" on public.teams;

-- Profiles policies
create policy "profiles select own"
on public.profiles for select
to authenticated
using (auth.uid() = id);

create policy "profiles insert own"
on public.profiles for insert
to authenticated
with check (auth.uid() = id);

create policy "profiles update own"
on public.profiles for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

-- Teams policies (authenticated users can collaborate for class use)
create policy "teams authenticated select"
on public.teams for select
to authenticated
using (true);

create policy "teams authenticated insert"
on public.teams for insert
to authenticated
with check (auth.uid() = created_by);

create policy "teams authenticated update"
on public.teams for update
to authenticated
using (true)
with check (true);

-- Custom scenarios policies (admin enforced in DB)
create policy "custom scenarios authenticated select"
on public.custom_scenarios for select
to authenticated
using (true);

create policy "custom scenarios authenticated insert"
on public.custom_scenarios for insert
to authenticated
with check (auth.uid() = created_by and public.is_admin());

create policy "custom scenarios authenticated update"
on public.custom_scenarios for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "custom scenarios admin delete"
on public.custom_scenarios for delete
to authenticated
using (public.is_admin());

-- Results policies
create policy "results authenticated select"
on public.results for select
to authenticated
using (true);

create policy "results authenticated insert"
on public.results for insert
to authenticated
with check (auth.uid() = user_id);

create policy "results admin delete"
on public.results for delete
to authenticated
using (public.is_admin());

create policy "teams admin delete"
on public.teams for delete
to authenticated
using (public.is_admin());
