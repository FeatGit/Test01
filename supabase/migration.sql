create table messages (
  id uuid primary key default gen_random_uuid(),
  text text not null,
  author text not null default 'Anonimo',
  user_id uuid references auth.users(id),
  created_at timestamptz default now()
);

alter table messages disable row level security;
