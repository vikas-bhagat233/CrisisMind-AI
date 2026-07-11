-- CrisisMind AI - Supabase / Postgres schema
-- Run this in the Supabase SQL editor (or via `supabase db push`).

create extension if not exists "uuid-ossp";

create table if not exists reports (
    id uuid primary key default uuid_generate_v4(),
    created_at timestamptz not null default now(),
    query text not null,
    crisis_type text not null,
    location text not null,
    payload jsonb not null,
    user_id text
);

create index if not exists reports_created_at_idx on reports (created_at desc);
create index if not exists reports_crisis_type_idx on reports (crisis_type);
create index if not exists reports_user_id_idx on reports (user_id);

-- Optional: row-level security, once real auth is wired up.
-- alter table reports enable row level security;
-- create policy "Users can read their own reports"
--   on reports for select
--   using (auth.uid()::text = user_id);
