create table books (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  title text not null,
  author text,
  cover_colors jsonb not null default '["#F3E5AB", "#D2B48C"]'::jsonb,
  content jsonb not null default '{"pages": []}'::jsonb,
  progress numeric not null default 0,
  last_read timestamp with time zone default now(),
  created_at timestamp with time zone default now()
);

alter table books enable row level security;

create policy "Users can view their own books"
  on books for select
  using (auth.uid() = user_id);

create policy "Users can insert their own books"
  on books for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own books"
  on books for update
  using (auth.uid() = user_id);

create policy "Users can delete their own books"
  on books for delete
  using (auth.uid() = user_id);
