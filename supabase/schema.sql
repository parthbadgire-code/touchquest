-- =====================================================================================
-- TouchQuest: PostgreSQL Database Schema & Row-Level Security (RLS)
-- Built for Hacktoberfest Open-Source AI Challenge: "Touch Grass"
-- =====================================================================================

-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";

-- 2. USER PROFILES TABLE (Linked to auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  username text unique,
  avatar_url text,
  streak_days integer default 0 not null,
  total_missions_completed integer default 0 not null,
  total_outdoor_minutes integer default 0 not null,
  species_discovered_count integer default 0 not null,
  level_title text default 'Woodland Novice' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS: Profiles
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- 3. OUTDOOR MISSIONS TABLE
create table if not exists public.missions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  duration_minutes integer not null check (duration_minutes in (15, 30, 60)),
  description text not null,
  theme text default 'sensory' not null,
  difficulty text default 'easy' not null,
  status text default 'active' not null check (status in ('active', 'completed', 'abandoned')),
  steps jsonb default '[]'::jsonb not null,
  outdoor_focus_tip text,
  completed_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_missions_user_status on public.missions(user_id, status);

-- RLS: Missions
alter table public.missions enable row level security;

create policy "Users can view their own missions"
  on public.missions for select
  using (auth.uid() = user_id);

create policy "Users can create their own missions"
  on public.missions for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own missions"
  on public.missions for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own missions"
  on public.missions for delete
  using (auth.uid() = user_id);

-- 4. SPECIES SIGHTINGS (Nature Scanner & BirdCall AI)
create table if not exists public.species_sightings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  kingdom text not null check (kingdom in ('plant', 'fungi', 'animal', 'bird', 'insect')),
  common_name text not null,
  scientific_name text not null,
  confidence numeric(4, 3) not null,
  notes text,
  image_url text,
  audio_url text,
  location_name text,
  latitude double precision,
  longitude double precision,
  model_used text not null, -- e.g. "Sisigoks/FloraSense" or "dima806/bird_sounds_classification"
  detected_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_sightings_user on public.species_sightings(user_id);
create index if not exists idx_sightings_kingdom on public.species_sightings(kingdom);

-- RLS: Species Sightings
alter table public.species_sightings enable row level security;

create policy "Users can view their own species sightings"
  on public.species_sightings for select
  using (auth.uid() = user_id);

create policy "Users can insert their own species sightings"
  on public.species_sightings for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own species sightings"
  on public.species_sightings for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own species sightings"
  on public.species_sightings for delete
  using (auth.uid() = user_id);

-- 5. NATURE JOURNAL ENTRIES
create table if not exists public.journal_entries (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  content text not null,
  duration_spent_minutes integer default 15 not null,
  weather text,
  sighting_id uuid references public.species_sightings(id) on delete set null,
  mission_id uuid references public.missions(id) on delete set null,
  tags text[] default array[]::text[] not null,
  media_urls text[] default array[]::text[] not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_journal_user on public.journal_entries(user_id);

-- RLS: Journal Entries
alter table public.journal_entries enable row level security;

create policy "Users can view their own journal entries"
  on public.journal_entries for select
  using (auth.uid() = user_id);

create policy "Users can insert their own journal entries"
  on public.journal_entries for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own journal entries"
  on public.journal_entries for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own journal entries"
  on public.journal_entries for delete
  using (auth.uid() = user_id);

-- 6. PROFILE TRIGGER ON NEW AUTH USER
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, username)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 7. STORAGE BUCKETS SETUP (Execute in Supabase SQL editor)
-- insert into storage.buckets (id, name, public) values ('journal-media', 'journal-media', true);
-- insert into storage.buckets (id, name, public) values ('scanner-uploads', 'scanner-uploads', true);
-- insert into storage.buckets (id, name, public) values ('audio-recordings', 'audio-recordings', true);
