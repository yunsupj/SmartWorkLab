-- Create ENUM for price model
create type price_model_type as enum ('Free', 'Paid', 'Freemium');

-- Tools Table
create table tools (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  category text not null,
  description text,
  price_model price_model_type default 'Freemium',
  affiliate_link text,
  api_available boolean default false,
  website_url text,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create ENUM for review status
create type review_status as enum ('pending', 'approved', 'insufficient_data');

-- Reviews Table (Multi-language support)
create table reviews (
  id uuid default gen_random_uuid() primary key,
  tool_id uuid references tools(id) on delete cascade not null,
  locale text not null, -- 'en', 'ko', 'de'
  title text not null,
  body text,
  summary text,
  pros text[],
  cons text[],
  critical_flaws text[], -- Mandatory 'Honesty-First' field
  transparency_source_count int default 0, -- For Transparency Meter
  status review_status default 'pending',
  author text default 'SmartWorkLab AI',
  smart_score jsonb, -- { roi: number, privacy: number, integration: number, total: number }
  competitors jsonb, -- Array of competitor names
  rating integer check (rating >= 0 and rating <= 5),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(tool_id, locale)
);

-- Metrics Table (Real-time data)
create table metrics (
  id uuid default gen_random_uuid() primary key,
  tool_id uuid references tools(id) on delete cascade not null,
  price_current numeric,
  sentiment_score numeric, -- Reddit/Twitter score
  source text, -- 'reddit', 'twitter', 'internal'
  recorded_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS (Row Level Security)
alter table tools enable row level security;
alter table reviews enable row level security;
alter table metrics enable row level security;

-- Create policies (Public read access)
create policy "Public tools are viewable by everyone" on tools
  for select using (true);

create policy "Public reviews are viewable by everyone" on reviews
  for select using (true);

create policy "Public metrics are viewable by everyone" on metrics
  for select using (true);

-- Profiles Table (for authenticated users)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  role text default 'user',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Leads Table (for calculator email capture)
create table leads (
  id uuid default gen_random_uuid() primary key,
  email text not null,
  source text default 'calculator',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table profiles enable row level security;
alter table leads enable row level security;

create policy "Users can insert their own profile" on profiles
  for insert with check (auth.uid() = id);

create policy "Users can view their own profile" on profiles
  for select using (auth.uid() = id);

    for insert with check (true);

-- Click Analytics Table
create table click_analytics (
  id uuid default gen_random_uuid() primary key,
  element_id text not null, -- e.g. 'savings-calc-btn', 'affiliate-link-cursor'
  tool_id uuid references tools(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table click_analytics enable row level security;

create policy "Public can insert clicks" on click_analytics
  for insert with check (true);

-- Update leads to store report
alter table leads add column report_data jsonb;
