# ARCHITECTURE.md — SmartWorkLab 2.0
### Single Source of Truth for the Pivot: AI Tool Review Site → Expert Tech Blog & B2B AI Agency

> **Status:** ✅ APPROVED — Phase 2 Execution in progress.
> **Author:** System Audit · March 2026
> **Last Updated:** March 2026 (Post-approval finalization)
> **Scope:** Database schema redesign, UI component remapping, URL/routing taxonomy, SEO redirect strategy.

---

## 0. Executive Summary

SmartWorkLab is pivoting from a **generalist AI tool review/affiliate site** to a **high-end Expert Tech Blog & B2B AI Agency** (SmartWorkLab Lab). The brand's competitive moat is E-E-A-T: real ML implementations, paper reviews, and Tier-based AI development services. This document defines all changes required from the database up to the URL structure, without breaking existing SEO equity.

---

## 1. Current Codebase Audit

### 1.1 Tech Stack

| Layer | Current |
|---|---|
| Framework | Next.js 15 (App Router + `[locale]` segment) |
| Language | TypeScript |
| Styling | Tailwind CSS (dark `slate-950` palette) |
| Database | Supabase (PostgreSQL + RLS) |
| Auth | Supabase Auth |
| i18n | `next-intl` (EN / KO / DE) |
| Deployment | Vercel |
| Agents | Custom `Analyst` agent at `lib/agents/analyst.ts` |

### 1.2 Current Route Tree

```
app/
├── [locale]/
│   ├── page.tsx                  ← Homepage (tool spotlights + calculators + AgencyCTA)
│   ├── layout.tsx                ← Root layout (Navigation, Footer, AuthProvider)
│   ├── reviews/
│   │   ├── page.tsx              ← Review listing (LabReport cards, Analyst agent)
│   │   └── [id]/page.tsx         ← Individual tool deep-dive
│   ├── compare/
│   │   └── [pair]/page.tsx       ← Tool A vs. Tool B comparison pages
│   ├── metrics/page.tsx          ← Analytics dashboard (admin-gated)
│   ├── about/page.tsx            ← About page (Methodology section)
│   ├── admin/                    ← CMS-style admin panel
│   ├── login/page.tsx
│   ├── privacy/page.tsx
│   └── terms/page.tsx
├── api/                          ← API routes (click tracking, sitemaps, etc.)
├── robots.ts
└── sitemap.ts
```

### 1.3 Current Database Schema (Supabase)

| Table | Purpose | Key Fields |
|---|---|---|
| `products` | AI tools catalog | `id, name, category, price_model, affiliate_link, image_url` |
| `reviews` | Multi-locale expert reports | `product_id, locale, title, body, pros, cons, smart_score (jsonb), critical_flaws[]` |
| `metrics` | Real-time price/sentiment | `product_id, price_current, sentiment_score, source` |
| `profiles` | Auth users | `id, email, role` |
| `leads` | Calculator email capture | `email, source, report_data (jsonb)` |
| `click_analytics` | Affiliate click tracking | `element_id, product_id` |

**Verdict:** The `products` + `reviews` schema is too narrowly coupled to tool reviews (pros/cons, pricing, affiliate links). It cannot natively represent technical blog posts, code snippets, LaTeX formulas, or tiered agency services without significant additions.

### 1.4 Current Component Inventory

| Component | File | Current Role | Recyclable? |
|---|---|---|---|
| `TopTenPicks` | `components/TopTenPicks.tsx` | Card grid for top 10 AI tools | ✅ Shell → `ProjectShowcaseCard` |
| `LabReport` | `components/reviews/LabReport.tsx` | Confidence/Accuracy stat panel | ✅ Repurpose → `TechPostMetaPanel` |
| `RelatedReports` | `components/reviews/RelatedReports.tsx` | "You might also like" cards | ✅ → `RelatedPosts` |
| `AgencyCTA` | `components/AgencyCTA.tsx` | Generic email CTA | ✅ Expand → `ServicesTierCTA` |
| `Navigation` | `components/Navigation.tsx` | Nav with locale switcher + auth | ✅ Update nav links only |
| `Footer` | `components/Footer.tsx` | Footer links | ✅ Minimal update |
| `TableOfContents` | `components/TableOfContents.tsx` | Heading navigator | ✅ Directly reusable for long blog posts |
| `ServiceInquiry` | `components/ServiceInquiry.tsx` | Contact/inquiry form | ✅ Expand for service tier selection |
| `SavingsCalculator` | `components/SavingsCalculator.tsx` | ROI calculator (homepage) | ⚠️ De-prioritize or move to `/services` |
| `RoiCalculator` | `components/RoiCalculator.tsx` | ROI widget | ⚠️ Only relevant in agency context |
| `TransparencyMeter` | `components/TransparencyMeter.tsx` | Source count badge | ⚠️ Repurpose as "Complexity Meter" |
| `AdPlaceholder` | `components/AdPlaceholder.tsx` | AdSense slots | ❌ Remove from Lab posts (keep on tools pages) |
| `PriceTracker` | `components/PriceTracker.tsx` | Live token/price ticker | ❌ Retire or move to archival redirect |
| `PromoTicker` | `components/PromoTicker.tsx` | Promo scrolling ticker | ❌ Retire |
| `ReviewForm` | `components/reviews/ReviewForm.tsx` | Admin review input | ❌ Replace with MDX/Markdown CMS intake |
| `ReviewActions` | `components/reviews/ReviewActions.tsx` | Admin CRUD buttons | ❌ Replace with CMS workflow |

---

## 2. New Database Schema Requirements

> **Strategy:** Additive migration only. All existing tables (`products`, `reviews`, `metrics`) are preserved for backward compatibility and SEO continuity of existing URLs. New tables are additive.

### 2.1 `tech_posts` Table

Stores deep-dive technical blog posts. Supports LaTeX, code snippets, interactive SVG, and multi-locale content.

```sql
create table tech_posts (
  id             uuid default gen_random_uuid() primary key,

  -- Content Identity
  slug           text not null unique,         -- e.g. 'vton-multi-item-synthesis'
  locale         text not null default 'en',   -- 'en', 'ko', 'de'
  title          text not null,
  subtitle       text,
  excerpt        text,                         -- 160-char SEO meta description
  cover_image_url text,

  -- Rich Content
  body_mdx       text,                         -- Full MDX/Markdown body (primary)
  toc_headings   jsonb,                        -- [{ id, text, level }] pre-computed

  -- Technical Metadata
  tags           text[],                       -- ['VTON', 'Diffusion', 'PyTorch']
  series         text,                         -- e.g. 'ML Paper Reviews', 'Agentic Workflows'
  has_latex      boolean default false,
  has_code       boolean default false,
  has_svg_demo   boolean default false,        -- Interactive "Show Me" simulation

  -- Authorship & SEO
  author         text default 'SmartWorkLab Engineering',
  published_at   timestamp with time zone,
  updated_at     timestamp with time zone default now(),
  is_published   boolean default false,
  read_time_min  int,                          -- Estimated read time in minutes

  -- Engagement
  view_count     bigint default 0,
  like_count     bigint default 0,

  created_at     timestamp with time zone default timezone('utc', now()) not null
);

-- Indexes
create index idx_tech_posts_slug on tech_posts(slug);
create index idx_tech_posts_series on tech_posts(series);
create index idx_tech_posts_tags on tech_posts using gin(tags);
create index idx_tech_posts_published on tech_posts(is_published, published_at desc);
```

**Planned initial posts to seed:**
- `vton-multi-item-synthesis` — VTON Multi-Item Synthesis using Single Inference
- `pickle-ai-agentic-workflows` — Pickle AI Agentic Workflows
- `mapz-spatial-data-processing` — Mapz Spatial Data Processing

### 2.2 `agency_services` Table

Stores tier-based service offerings for the B2B agency.

```sql
create type service_tier as enum ('tier_1', 'tier_2', 'tier_3', 'enterprise');
create type service_status as enum ('available', 'waitlist', 'coming_soon');

create table agency_services (
  id             uuid default gen_random_uuid() primary key,

  -- Service Identity
  slug           text not null unique,          -- e.g. 'rsvp-event-sites'
  tier           service_tier not null,
  name           text not null,                 -- e.g. 'RSVP / Event Microsites'
  tagline        text,
  description    text,

  -- Pricing
  price_usd      numeric,                       -- Base price or null if custom
  price_label    text,                          -- e.g. 'Starting at $499' or 'Custom'
  is_recurring   boolean default false,
  billing_cycle  text,                          -- 'one-time', 'monthly', 'yearly'

  -- Content
  features       text[],                        -- Bullet list of what's included
  deliverables   text[],                        -- What the client receives
  timeline_days  int,                           -- Estimated delivery time
  case_study_url text,                          -- Link to a tech_post slug or external URL
  demo_url       text,                          -- Live demo link (e.g. Ellie Birthday RSVP)

  -- Visibility
  status         service_status default 'available',
  display_order  int default 0,                 -- For manual sort on /services page

  created_at     timestamp with time zone default timezone('utc', now()) not null
);
```

**Confirmed service tiers — APPROVED ✅:**

| Tier | Label | Name | Price Range | Example |
|---|---|---|---|---|
| `tier_1` | Entry | RSVP / Event Microsites | ~$499 one-time | Ellie Birthday RSVP site |
| `tier_2` | Growth | RAG Chatbots & Knowledge Bases | ~$1,500–$3,000 | Custom RAG on private docs |
| `tier_3` | Enterprise | AI Agents / VTON & Spatial AI | Custom quote | Agentic workflows, VTON inference |

### 2.3 `post_interactions` Table

Lightweight engagement tracking (replaces `click_analytics` for blog content).

```sql
create table post_interactions (
  id       uuid default gen_random_uuid() primary key,
  post_id  uuid references tech_posts(id) on delete cascade,
  type     text not null,           -- 'view', 'like', 'share', 'demo_click'
  session  text,                    -- Anonymous session fingerprint
  created_at timestamp with time zone default timezone('utc', now()) not null
);
```

---

## 3. Component Mapping (Old → New)

### 3.1 `TopTenPicks` → `ProjectShowcaseCard`

**File:** `components/TopTenPicks.tsx` → `components/lab/ProjectShowcaseCard.tsx`

| Before | After |
|---|---|
| Fetches from `products` table | Fetches from `tech_posts` table |
| Shows: tool name, category, rating, "Read Full Lab Report" CTA | Shows: post title, series tag, estimated read time, "Read Deep Dive" CTA |
| `#1`, `#2` rank numbering | Replaced by series badge (e.g., `ML Paper Review`, `Agentic`) |
| `/reviews/{tool-slug}` link | `/lab/{post-slug}` link |
| `smart_score` badge | `read_time_min` + `has_latex` / `has_code` badges |

**Recyclable elements:** card shell (`bg-slate-900/50 backdrop-blur rounded-xl`), spotlight hover effect, grid layout, FadeIn animation wrapper. Minimal re-write required.

### 3.2 `LabReport` → `TechPostMetaPanel`

**File:** `components/reviews/LabReport.tsx` → `components/lab/TechPostMetaPanel.tsx`

| Before | After |
|---|---|
| 3-stat panel: Confidence Score, Accuracy Rating, Market Position | 3-stat panel: Complexity Score, Read Time, Tech Stack |
| "SmartWorkLab Verification" title | "Research Report" or "Implementation Report" |
| `confidenceScore`, `accuracyRating` fields | `complexity_score`, `read_time_min`, `tags[]` fields |
| "Last Audited" timestamp | "Last Updated" + "Published" dates |

**Recyclable elements:** Entire card shell, 3-column stat grid, icon treatment, border gradient logic.

### 3.3 `RelatedReports` → `RelatedPosts`

**File:** `components/reviews/RelatedReports.tsx` → `components/lab/RelatedPosts.tsx`

| Before | After |
|---|---|
| Fetches by `category` from `products` | Fetches by `series` or overlapping `tags` from `tech_posts` |
| "Related Expert Reports" heading | "More from the Lab" heading |
| `/reviews/{slug}` links | `/lab/{slug}` links |
| Shows: `smart_score`, tool name | Shows: series tag, title, excerpt |

**Recyclable elements:** Full card grid layout, hover animations, "View All" link pattern.

### 3.4 `AgencyCTA` → `ServicesTierCTA`

**File:** `components/AgencyCTA.tsx` → `components/agency/ServicesTierCTA.tsx`

| Before | After |
|---|---|
| Single CTA with mailto link | 3-column tier cards (Tier 1, 2, 3) each with a CTA |
| "Build Your Custom AI Agent Website" | Tiered headline + per-tier pricing |
| mailto → email | Primary CTA → `/services` page, secondary → `ServiceInquiry` modal |

**Recyclable elements:** Glow gradient border effect, dark card shell, gradient CTA button styling.

### 3.5 `ReviewDetail` (implicit) → `InteractiveBlogLayout`

**File:** `app/[locale]/reviews/[id]/page.tsx` → `app/[locale]/lab/[slug]/page.tsx`

| Before | After |
|---|---|
| Tool name as H1, pros/cons list, smart_score breakdown | MDX rendered body with LaTeX (via KaTeX), syntax highlighted code blocks |
| `LabReport` verification panel | `TechPostMetaPanel` at top |
| `RelatedReports` at bottom | `RelatedPosts` at bottom |
| No interactive elements | Optional "Show Me" SVG simulation module (gated per post) |
| No TOC | `TableOfContents` sidebar (already exists, directly reusable) |

### 3.6 `Navigation` — Link Updates Only

No structural change needed. Only nav link labels and destinations update:

| Current Link | New Link | Label Change |
|---|---|---|
| `{t('tools')}` → `/` | `/` | "Lab" or "Home" |
| `{t('reviews')}` → `/reviews` | `/lab` | "Deep Dives" |
| `/metrics` | `/services` | "Services" |
| `/about` | `/about` | No change |

---

## 4. URL & Routing Strategy

### 4.1 New URL Taxonomy

```
/                                  ← Homepage (now features Latest Lab Posts + Agency intro)
/lab                               ← Tech blog index (replaces /reviews listing)
/lab/[slug]                        ← Individual deep-dive post
/lab/series/[series]               ← Filter by series (e.g. /lab/series/ml-paper-reviews)
/services                          ← B2B Agency page (tier showcase)
/services/[slug]                   ← Individual service detail (optional phase 2)
/about                             ← About (keep, update Methodology section)
/privacy                           ← No change
/terms                             ← No change

-- Preserved for SEO continuity (do not delete):
/reviews                           ← Old review listing (serve 301 → /lab OR keep as archive)
/reviews/[id]                      ← Old review detail (serve 301 → /lab/[equivalent-slug])
```

### 4.2 Redirect Strategy — CONFIRMED ✅

> **Decision:** All `/reviews/*` pages are AdSense-flagged as "low value" content. They must be **hard 301-redirected** to `/lab` and removed from the active sitemap entirely to reset E-E-A-T. No legacy archive will be maintained.

| Old Route | Action | Destination | HTTP Code |
|---|---|---|---|
| `/[locale]/compare/:pair` | Hard redirect | `/:locale/services` | 301 |
| `/[locale]/reviews` | Hard redirect (scrub from sitemap) | `/:locale/lab` | 301 |
| `/[locale]/reviews/:id` | Hard redirect (scrub from sitemap) | `/:locale/lab` | 301 |
| `/[locale]/metrics` | Hard redirect | `/:locale/services` | 301 |

**Implementation — `next.config.ts`:**

```ts
async redirects() {
  return [
    // /reviews → /lab (full scrub of old tool review pages)
    {
      source: '/:locale/reviews',
      destination: '/:locale/lab',
      permanent: true,
    },
    {
      source: '/:locale/reviews/:id',
      destination: '/:locale/lab',
      permanent: true,
    },
    // /compare → /services
    {
      source: '/:locale/compare/:pair',
      destination: '/:locale/services',
      permanent: true,
    },
    // /metrics → /services
    {
      source: '/:locale/metrics',
      destination: '/:locale/services',
      permanent: true,
    },
  ];
},
```

> **Sitemap action:** Remove all `products`-based URLs. Only include `tech_posts` where `is_published = true` for `/lab/*` entries. Submit updated sitemap to Google Search Console after deploy.

### 4.3 Sitemap & Robots Updates

- `sitemap.ts`: Add dynamic entries for `tech_posts` where `is_published = true`. Remove entries for `/compare` routes.
- `robots.ts`: No changes needed; current config is already permissive for Googlebot.

---

## 5. i18n Considerations

- **Phase 1 (MVP):** All new `tech_posts` are authored in English only (`locale = 'en'`). Korean/German translations are Phase 2.
- The `tech_posts` table has a `locale` field, making future i18n additive without schema changes.
- Navigation translation keys (`tools`, `reviews`, `metrics`, `getRoiReport`) in the `messages/` JSON files will need new keys: `lab`, `deepDives`, `services`.

---

## 6. SEO & E-E-A-T Considerations

| Signal | Current State | Target State |
|---|---|---|
| **Expertise** | "SmartWorkLab AI" as author | Named author + credentials ("SmartWorkLab Engineering · ML Team") |
| **Experience** | Generic tool summaries | Real implementation writeups with code, benchmarks, and results |
| **Authoritativeness** | Tool review affiliate site | Paper reviews citing arXiv, GitHub repos linked, demo deployments linked |
| **Trustworthiness** | Transparency Meter (source count) | Open methodology in `/about`, cited sources in post body, live demo links |
| **Structured Data** | None confirmed | Add `Article` + `TechArticle` JSON-LD to `/lab/[slug]` pages |
| **Internal Linking** | `/reviews` ↔ `/` | `/lab` posts ↔ `/services` (convert readers to leads) |

---

## 7. Dependency Requirements (New Packages)

| Package | Purpose | Phase |
|---|---|---|
| `next-mdx-remote` or `@next/mdx` | Render MDX body from DB string | Phase 2 (content) |
| `katex` or `react-katex` | LaTeX formula rendering in posts | Phase 2 (content) |
| `rehype-highlight` or `shiki` | Code syntax highlighting | Phase 2 (content) |
| *(No new DB dependencies needed)* | Supabase already in place | — |

---

## 8. Migration Phases

| Phase | Scope | Status |
|---|---|---|
| **Phase 0: Audit** | Codebase audit + `ARCHITECTURE.md` | ✅ Complete |
| **Phase 1: Docs** | Finalize `ARCHITECTURE.md` + `README.md` | ✅ Complete |
| **Phase 2: DB** | Add `tech_posts` + `agency_services` via Supabase migration | 🔄 In Progress |
| **Phase 3: Routing** | New `/lab` + `/services` dirs; 301 redirects in `next.config.ts`; sitemap update | 🔄 In Progress |
| **Phase 4: Components** | Remap components per Section 3; build `/lab/[slug]` render pipeline | ⏳ Next |
| **Phase 5: Content** | Seed 3 initial `tech_posts`; update homepage to pull from `tech_posts` | ⏳ Queued |
| **Phase 6: Services Page** | Build `/services` page with `agency_services` data; tier cards | ⏳ Queued |

---

*This document is the single source of truth for the SmartWorkLab 2.0 pivot. No code changes should be made until this architecture is approved.*
