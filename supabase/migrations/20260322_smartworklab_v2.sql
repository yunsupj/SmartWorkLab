-- =============================================================================
-- SmartWorkLab 2.0 — Migration: Tech Posts & Agency Services
-- Date: 2026-03-22
-- Description: Additive migration. Adds tech_posts, agency_services, and
--              post_interactions tables. No existing tables are modified.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- ENUMS
-- ---------------------------------------------------------------------------

create type service_tier as enum ('tier_1', 'tier_2', 'tier_3', 'enterprise');
create type service_status as enum ('available', 'waitlist', 'coming_soon');


-- ---------------------------------------------------------------------------
-- TABLE: tech_posts
-- Stores deep-dive technical blog posts supporting MDX, LaTeX, code snippets,
-- and interactive SVG "Show Me" simulation modules.
-- ---------------------------------------------------------------------------

create table tech_posts (
  id               uuid default gen_random_uuid() primary key,

  -- Content Identity
  slug             text not null unique,         -- e.g. 'vton-multi-item-synthesis'
  locale           text not null default 'en',   -- 'en', 'ko', 'de'
  title            text not null,
  subtitle         text,
  excerpt          text,                         -- ≤160 chars: SEO meta description
  cover_image_url  text,

  -- Rich Content
  body_mdx         text,                         -- Full MDX/Markdown body
  toc_headings     jsonb,                        -- [{ id, text, level }] pre-computed

  -- Technical Metadata
  tags             text[],                       -- ['VTON', 'Diffusion', 'PyTorch']
  series           text,                         -- 'ML Paper Reviews' | 'Agentic Workflows' | 'Spatial AI'
  has_latex        boolean default false,
  has_code         boolean default false,
  has_svg_demo     boolean default false,        -- Interactive "Show Me" simulation module

  -- Authorship & SEO
  author           text default 'SmartWorkLab Engineering',
  published_at     timestamp with time zone,
  updated_at       timestamp with time zone default now(),
  is_published     boolean default false,
  read_time_min    int,                          -- Estimated reading time (minutes)

  -- Engagement counters (denormalized for fast reads)
  view_count       bigint default 0,
  like_count       bigint default 0,

  created_at       timestamp with time zone default timezone('utc', now()) not null
);

-- Indexes for common query patterns
create index idx_tech_posts_slug        on tech_posts(slug);
create index idx_tech_posts_series      on tech_posts(series);
create index idx_tech_posts_tags        on tech_posts using gin(tags);
create index idx_tech_posts_published   on tech_posts(is_published, published_at desc);
create index idx_tech_posts_locale      on tech_posts(locale, is_published);

-- RLS
alter table tech_posts enable row level security;

create policy "Public published posts are viewable by everyone"
  on tech_posts for select
  using (is_published = true);

create policy "Authenticated users can manage posts"
  on tech_posts for all
  using (auth.role() = 'authenticated');


-- ---------------------------------------------------------------------------
-- TABLE: agency_services
-- Stores tier-based service offerings for the B2B AI agency arm.
-- ---------------------------------------------------------------------------

create table agency_services (
  id               uuid default gen_random_uuid() primary key,

  -- Service Identity
  slug             text not null unique,         -- e.g. 'rsvp-event-sites'
  tier             service_tier not null,
  tier_label       text not null,               -- 'Entry' | 'Growth' | 'Enterprise'
  name             text not null,               -- e.g. 'RSVP / Event Microsites'
  tagline          text,                        -- One-liner hero copy
  description      text,                        -- Full-paragraph description

  -- Pricing
  price_usd        numeric,                     -- Base price; null = custom quote
  price_label      text,                        -- e.g. 'Starting at $499' | 'Custom'
  is_recurring     boolean default false,
  billing_cycle    text,                        -- 'one-time' | 'monthly' | 'yearly'

  -- Content
  features         text[],                     -- Bullet list of what's included
  deliverables     text[],                     -- What the client receives
  timeline_days    int,                        -- Estimated delivery time
  case_study_slug  text,                       -- References a tech_posts.slug
  demo_url         text,                       -- Live demo link

  -- Visibility
  status           service_status default 'available',
  display_order    int default 0,              -- Manual sort on /services page
  icon_name        text,                       -- Lucide icon name (e.g. 'Sparkles')
  accent_color     text,                       -- Tailwind color token (e.g. 'cyan')

  created_at       timestamp with time zone default timezone('utc', now()) not null
);

-- Indexes
create index idx_agency_services_tier    on agency_services(tier);
create index idx_agency_services_status  on agency_services(status, display_order);

-- RLS
alter table agency_services enable row level security;

create policy "Public services are viewable by everyone"
  on agency_services for select
  using (true);

create policy "Authenticated users can manage services"
  on agency_services for all
  using (auth.role() = 'authenticated');


-- ---------------------------------------------------------------------------
-- TABLE: post_interactions
-- Lightweight engagement tracking for lab posts (replaces click_analytics
-- for blog content). Separates blog metrics from affiliate click metrics.
-- ---------------------------------------------------------------------------

create table post_interactions (
  id         uuid default gen_random_uuid() primary key,
  post_id    uuid references tech_posts(id) on delete cascade,
  type       text not null,            -- 'view' | 'like' | 'share' | 'demo_click'
  session    text,                     -- Anonymous session fingerprint (no PII)
  created_at timestamp with time zone default timezone('utc', now()) not null
);

create index idx_post_interactions_post   on post_interactions(post_id, type);
create index idx_post_interactions_time   on post_interactions(created_at desc);

alter table post_interactions enable row level security;

create policy "Anyone can log interactions"
  on post_interactions for insert
  with check (true);

create policy "Authenticated users can read interactions"
  on post_interactions for select
  using (auth.role() = 'authenticated');


-- ---------------------------------------------------------------------------
-- SEED: Initial Agency Services (3-tier structure)
-- ---------------------------------------------------------------------------

insert into agency_services
  (slug, tier, tier_label, name, tagline, description, price_usd, price_label,
   is_recurring, billing_cycle, features, deliverables, timeline_days,
   demo_url, status, display_order, icon_name, accent_color)
values
  (
    'rsvp-event-sites',
    'tier_1', 'Entry',
    'RSVP & Event Microsites',
    'Beautiful event sites, built in days.',
    'Custom-designed event microsites with RSVP forms, photo guestbooks, countdown timers, and automated reminder emails. Perfect for birthday parties, weddings, and brand activations.',
    499, 'Starting at $499',
    false, 'one-time',
    ARRAY['Custom design & branding', 'RSVP form + Supabase backend', 'Photo guestbook with Polaroid layout', 'Automated email reminders (Resend)', 'Google Calendar integration', 'Mobile-first responsive'],
    ARRAY['Deployed Next.js site on Vercel', 'Custom domain setup', 'Source code handoff', '30-day support'],
    7,
    'https://ellie-rsvp.vercel.app',
    'available', 1,
    'Sparkles', 'cyan'
  ),
  (
    'rag-chatbots',
    'tier_2', 'Growth',
    'RAG Chatbots & Knowledge Bases',
    'Your documents, instantly queryable.',
    'Production-grade Retrieval-Augmented Generation (RAG) systems built on your private data. Supports PDFs, Notion exports, Confluence wikis, and custom data pipelines with a branded chat UI.',
    null, 'From $1,500',
    false, 'one-time',
    ARRAY['Document ingestion pipeline (PDF, Notion, Confluence)', 'Vector embeddings (pgvector / Pinecone)', 'Streaming chat UI with citation display', 'Admin dashboard for doc management', 'Multi-tenant auth (Supabase)', 'Custom LLM routing (GPT-4o / Claude)'],
    ARRAY['Deployed RAG application', 'Admin CMS for knowledge base', 'Embedding pipeline scripts', 'Monitoring dashboard', 'Source code + documentation', '60-day support'],
    21,
    null,
    'available', 2,
    'Database', 'purple'
  ),
  (
    'enterprise-ai-agents',
    'tier_3', 'Enterprise',
    'Enterprise AI Agents & Custom ML',
    'Custom models. Real production deployments.',
    'End-to-end AI agent systems and custom ML implementations — from VTON (Virtual Try-On) inference pipelines to multi-step agentic workflows, spatial data processing, and fine-tuned model deployment.',
    null, 'Custom Quote',
    false, 'one-time',
    ARRAY['Custom ML model development & fine-tuning', 'VTON / Diffusion model pipelines', 'Agentic workflow orchestration (LangGraph / CrewAI)', 'Spatial data processing (H3 geospatial, PostGIS)', 'GPU inference deployment (Modal / Replicate / self-hosted)', 'Full CI/CD + monitoring stack'],
    ARRAY['Production ML system', 'Model artifacts & weights', 'Inference API with auth', 'Comprehensive technical documentation', 'Architecture handoff session', '90-day SLA support'],
    60,
    null,
    'available', 3,
    'Cpu', 'green'
  );
