-- AuraCareer AI — Supabase free-tier schema (v1, clean)
-- Run in Supabase SQL Editor (Dashboard → SQL) for a fresh project.
-- Existing projects: run each numbered migration file in order instead.

create extension if not exists "pgcrypto";

-- ── Profiles ──────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id             uuid primary key references auth.users(id) on delete cascade,
  email          text not null,
  name           text not null,
  plan           text not null default 'starter',
  avatar_url     text,
  phone          text,
  location       text,
  summary        text,
  career_goals   text,
  career_targets jsonb,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- ── Resumes ───────────────────────────────────────────────────────────────
create table if not exists public.resumes (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  file_name   text not null,
  file_url    text not null,
  file_size   double precision,
  mime_type   text not null,
  raw_text    text,
  ai_score    int,
  parsed_data jsonb,
  suggestions jsonb,
  status      text not null default 'uploaded',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ── Resume Versions ───────────────────────────────────────────────────────
create table if not exists public.resume_versions (
  id                  uuid primary key default gen_random_uuid(),
  resume_id           uuid not null references public.resumes(id) on delete cascade,
  user_id             uuid not null references public.profiles(id) on delete cascade,
  name                text not null,
  kind                text not null default 'improved',
  content_markdown    text not null,
  ai_score            int,
  optimization_notes  text,
  target_job_id       uuid,
  created_at          timestamptz not null default now()
);

-- ── Jobs (live scraper feed — no seed data) ───────────────────────────────
create table if not exists public.jobs (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  company     text not null,
  location    text not null,
  salary      text,
  description text not null,
  requirements jsonb not null default '[]'::jsonb,
  source      text not null default 'live',
  source_kind text not null default 'live',
  source_url  text,
  match_score int,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ── Applications ──────────────────────────────────────────────────────────
create table if not exists public.applications (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references public.profiles(id) on delete cascade,
  job_id            uuid not null references public.jobs(id) on delete cascade,
  resume_version_id uuid references public.resume_versions(id),
  cover_letter      text,
  status            text not null default 'applied',
  notes             text,
  applied_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  unique (user_id, job_id)
);

-- ── Application Queue (daily assisted-apply) ──────────────────────────────
create table if not exists public.application_queue (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references public.profiles(id) on delete cascade,
  job_id            uuid not null references public.jobs(id) on delete cascade,
  digest_date       date not null,
  match_score       int not null default 0,
  status            text not null default 'queued',
  tailored_markdown text,
  cover_letter      text,
  resume_version_id uuid references public.resume_versions(id),
  notes             text,
  apply_url         text,
  prepared_at       timestamptz,
  approved_at       timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  unique (user_id, job_id, digest_date)
);

-- ── Digest Runs ───────────────────────────────────────────────────────────
create table if not exists public.digest_runs (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  run_date    date not null,
  slot        text not null default 'morning',
  status      text not null default 'pending',
  jobs_found  int not null default 0,
  jobs_queued int not null default 0,
  error       text,
  started_at  timestamptz not null default now(),
  finished_at timestamptz,
  unique (user_id, run_date, slot)
);

-- ── Storage Bucket ────────────────────────────────────────────────────────
-- Also create via Dashboard → Storage → "resumes" (public bucket for CV uploads)
insert into storage.buckets (id, name, public)
values ('resumes', 'resumes', true)
on conflict (id) do nothing;

-- ── Row Level Security ────────────────────────────────────────────────────
alter table public.profiles          enable row level security;
alter table public.resumes           enable row level security;
alter table public.resume_versions   enable row level security;
alter table public.applications      enable row level security;
alter table public.jobs              enable row level security;
alter table public.application_queue enable row level security;
alter table public.digest_runs       enable row level security;

-- Profiles: user owns their own row
create policy "profiles_own" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

-- Resumes: user owns their own
create policy "resumes_own" on public.resumes
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Resume versions: user owns their own
create policy "versions_own" on public.resume_versions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Applications: user owns their own
create policy "applications_own" on public.applications
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Jobs: anyone can read; only service role can write (scraper)
create policy "jobs_read_all" on public.jobs
  for select using (true);

-- Application queue: user owns their own
create policy "queue_own" on public.application_queue
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Digest runs: user owns their own
create policy "digest_runs_own" on public.digest_runs
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ── Indexes ───────────────────────────────────────────────────────────────
create index if not exists application_queue_user_date_idx
  on public.application_queue (user_id, digest_date);

create index if not exists digest_runs_user_date_idx
  on public.digest_runs (user_id, run_date);

create index if not exists jobs_is_active_idx
  on public.jobs (is_active, source_kind);

-- ── Trigger: auto-create profile on signup ────────────────────────────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email, name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
