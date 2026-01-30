-- Create table for storing user tool usage data
create table if not exists public.user_tool_usage (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  tool_name text not null,
  monthly_cost numeric not null default 0,
  hours_saved numeric not null default 0,
  task_category text not null, -- e.g., 'Copywriting', 'Coding', 'Design'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.user_tool_usage enable row level security;

-- Policies
create policy "Users can view their own usage data"
  on public.user_tool_usage for select
  using (auth.uid() = user_id);

create policy "Users can insert their own usage data"
  on public.user_tool_usage for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own usage data"
  on public.user_tool_usage for update
  using (auth.uid() = user_id);

create policy "Users can delete their own usage data"
  on public.user_tool_usage for delete
  using (auth.uid() = user_id);
