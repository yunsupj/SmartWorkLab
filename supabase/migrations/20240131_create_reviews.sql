-- Create table for storing user reviews
create table if not exists public.user_reviews (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  tool_id uuid references public.products(id) on delete cascade, -- Optional link to products table if it exists
  tool_name text not null, -- Fallback if no product link
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.user_reviews enable row level security;

-- Policies
create policy "Users can view all reviews"
  on public.user_reviews for select
  using (true);

create policy "Users can insert their own reviews"
  on public.user_reviews for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own reviews"
  on public.user_reviews for update
  using (auth.uid() = user_id);

create policy "Users can delete their own reviews"
  on public.user_reviews for delete
  using (auth.uid() = user_id);
