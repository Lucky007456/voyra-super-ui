-- Trips table
create table public.trips (
  id uuid default gen_random_uuid() primary key,
  user_id text not null,
  destination text not null,
  duration integer not null,
  travelers text not null,
  budget text not null,
  interests text[] not null default '{}',
  result jsonb not null,
  created_at timestamptz default now()
);

create index trips_user_id_idx on public.trips(user_id);

alter table public.trips enable row level security;

create policy "Users can read own trips"
  on public.trips for select
  using (user_id = auth.uid()::text);

create policy "Users can insert own trips"
  on public.trips for insert
  with check (user_id = auth.uid()::text);

create policy "Users can delete own trips"
  on public.trips for delete
  using (user_id = auth.uid()::text);

-- Subscriptions table
create table public.subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id text not null unique,
  stripe_customer_id text,
  stripe_subscription_id text,
  plan text not null default 'explorer',
  billing_period text default 'monthly',
  status text not null default 'active',
  current_period_end timestamptz,
  created_at timestamptz default now()
);

-- Usage table
create table public.usage (
  id uuid default gen_random_uuid() primary key,
  user_id text not null,
  month text not null,
  trip_count integer default 0,
  unique(user_id, month)
);
