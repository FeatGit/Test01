create table messages (
  id uuid primary key default gen_random_uuid(),
  text text not null,
  created_at timestamptz default now()
);

alter table messages disable row level security;
