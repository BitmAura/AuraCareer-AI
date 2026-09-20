-- ====================================================================
-- AuraCareer AI (BitmAura) — Master Supabase Schema Migration
-- Project: fjvedzkatwgqtcwwortm
-- Apply in Supabase SQL Editor: https://supabase.com/dashboard/project/fjvedzkatwgqtcwwortm/sql/new
-- ====================================================================

create extension if not exists "pgcrypto";

-- 1. Profiles (Linked to Supabase Auth)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text not null,
  plan text not null default 'starter',
  avatar_url text,
  phone text,
  location text,
  summary text,
  career_goals text,
  career_targets jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Resumes
create table if not exists public.resumes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  file_name text not null,
  file_url text not null,
  file_size double precision,
  mime_type text not null,
  raw_text text,
  ai_score int,
  parsed_data jsonb,
  suggestions jsonb,
  status text not null default 'uploaded',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3. Resume Versions
create table if not exists public.resume_versions (
  id uuid primary key default gen_random_uuid(),
  resume_id uuid not null references public.resumes(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  kind text not null default 'improved',
  content_markdown text not null,
  ai_score int,
  optimization_notes text,
  target_job_id uuid,
  created_at timestamptz not null default now()
);

-- 4. Jobs Catalog
create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  company text not null,
  location text not null,
  salary text,
  description text not null,
  requirements jsonb not null default '[]'::jsonb,
  source text not null default 'manual',
  source_kind text default 'career_page',
  source_url text,
  match_score int,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 5. Applications (Kanban & Tracking)
create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  job_id uuid not null references public.jobs(id) on delete cascade,
  resume_version_id uuid references public.resume_versions(id),
  cover_letter text,
  status text not null default 'applied',
  notes text,
  applied_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 6. Daily Assisted-Apply Queue
create table if not exists public.application_queue (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  job_id uuid not null references public.jobs(id) on delete cascade,
  digest_date date not null,
  digest_slot text,
  match_score int not null default 0,
  status text not null default 'queued',
  tailored_markdown text,
  cover_letter text,
  resume_version_id uuid references public.resume_versions(id),
  notes text,
  apply_url text,
  prepared_at timestamptz,
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, job_id, digest_date)
);

-- 7. Digest Runs (3 Searches per Day)
create table if not exists public.digest_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  digest_date date not null,
  slot text not null,
  created_count int not null default 0,
  ran_at timestamptz not null default now()
);

-- Indices
create index if not exists application_queue_user_date_idx on public.application_queue (user_id, digest_date);
create index if not exists digest_runs_user_date_idx on public.digest_runs (user_id, digest_date);

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.resumes enable row level security;
alter table public.resume_versions enable row level security;
alter table public.jobs enable row level security;
alter table public.applications enable row level security;
alter table public.application_queue enable row level security;
alter table public.digest_runs enable row level security;

-- Policies
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

create policy "resumes_own" on public.resumes for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "resume_versions_own" on public.resume_versions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "applications_own" on public.applications for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "queue_own" on public.application_queue for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "digest_runs_own" on public.digest_runs for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "jobs_read_all" on public.jobs for select using (true);

-- Auto-create profile on signup trigger
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

revoke execute on function public.handle_new_user() from anon, public;

-- Protect profile plan from malicious RLS self-upgrading
create or replace function public.protect_profile_plan()
returns trigger language plpgsql security invoker set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    if coalesce(auth.jwt() ->> 'role', '') <> 'service_role' then
      new.plan := 'starter';
    end if;
    return new;
  end if;

  if new.plan is distinct from old.plan
     and coalesce(auth.jwt() ->> 'role', '') <> 'service_role' then
    new.plan := old.plan;
  end if;
  return new;
end;
$$;

drop trigger if exists protect_profile_plan_trg on public.profiles;
create trigger protect_profile_plan_trg
  before insert or update on public.profiles
  for each row execute function public.protect_profile_plan();

revoke all on function public.protect_profile_plan() from public, anon, authenticated;

-- Initial Seed Jobs with Direct ATS / Career URLs
insert into public.jobs (title, company, location, salary, description, requirements, source, source_kind, source_url, match_score)
select * from (values
  ('Senior Procurement Manager', 'Tata Steel', 'Mumbai', '25-35 LPA',
   'Lead strategic sourcing and vendor management for steel manufacturing operations across India.',
   '["Procurement","SAP MM","Negotiation","8+ years"]'::jsonb, 'career_page', 'career_page', 'https://www.tatasteel.com/careers/', 95),
  ('Supply Chain Lead', 'JSW Steel', 'Pune', '22-30 LPA',
   'Own end-to-end supply chain planning for integrated steel plants with focus on cost and OTIF.',
   '["Supply Chain","Logistics","Forecasting","6+ years"]'::jsonb, 'career_page', 'career_page', 'https://www.jsw.in/careers', 88),
  ('Purchase Executive', 'Vedanta', 'Chennai', '18-25 LPA',
   'Manage purchase orders, supplier follow-ups, and inventory alignment for plant operations.',
   '["Purchase","Vendor Management","MS Office","4+ years"]'::jsonb, 'career_page', 'career_page', 'https://www.vedantalimited.com/careers', 82),
  ('Quality Engineer', 'Bosch', 'Bangalore', '12-18 LPA',
   'Drive quality systems, root-cause analysis, and continuous improvement on the shop floor.',
   '["Quality","Six Sigma","ISO","3+ years"]'::jsonb, 'career_page', 'career_page', 'https://careers.bosch.com/in/', 78),
  ('Maintenance Manager', 'Hindalco', 'Renukoot', '20-28 LPA',
   'Lead preventive and breakdown maintenance for aluminum manufacturing assets.',
   '["Maintenance","TPM","Mechanical","7+ years"]'::jsonb, 'career_page', 'career_page', 'https://www.hindalco.com/careers', 74),
  ('Production Supervisor', 'Siemens', 'Aurangabad', '10-15 LPA',
   'Supervise shift production targets, safety, and manpower for industrial equipment lines.',
   '["Production","Lean","Team Leadership","5+ years"]'::jsonb, 'career_page', 'career_page', 'https://jobs.siemens.com/careers', 70)
) as v(title, company, location, salary, description, requirements, source, source_kind, source_url, match_score)
where not exists (select 1 from public.jobs limit 1);
