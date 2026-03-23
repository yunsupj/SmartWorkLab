# SmartWorkLab — Expert Tech Blog & B2B AI Agency

> **Live site:** [smartworklab.store](https://smartworklab.store) · **Stack:** Next.js 15 · Supabase · Vercel · `next-intl`

SmartWorkLab is a high-end expert tech blog and B2B AI development agency. We publish deep-dive ML implementations, paper reviews, and agentic workflow breakdowns — and build custom AI systems for clients.

---

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for the full single source of truth: database schema, component mapping, URL taxonomy, and migration phases.

---

## Project Structure

```
app/
├── [locale]/
│   ├── page.tsx              ← Homepage
│   ├── lab/                  ← Tech blog (deep-dive posts)
│   │   ├── page.tsx          ← Post listing index
│   │   └── [slug]/page.tsx   ← Individual post (MDX + LaTeX + code)
│   ├── services/             ← B2B Agency (tier cards + inquiry)
│   │   └── page.tsx
│   ├── about/
│   ├── login/
│   ├── privacy/
│   └── terms/
components/
├── lab/                      ← Blog-specific components
│   ├── ProjectShowcaseCard.tsx
│   ├── TechPostMetaPanel.tsx
│   └── RelatedPosts.tsx
├── agency/                   ← Agency/services components
│   └── ServicesTierCTA.tsx
└── ...                       ← Shared components (Navigation, Footer, etc.)
supabase/
├── schema.sql                ← v1 schema (products, reviews — maintained for SEO)
└── migrations/
    └── 20260322_smartworklab_v2.sql  ← v2: tech_posts, agency_services
```

---

## URL Structure

| Route | Description |
|---|---|
| `/` | Homepage — lab post highlights + agency intro |
| `/lab` | Tech blog listing |
| `/lab/[slug]` | Individual deep-dive post |
| `/lab/series/[series]` | Posts filtered by series |
| `/services` | B2B agency — 3-tier service showcase |
| `/about` | About page + methodology |

### 301 Redirects (Active)

| From | To |
|---|---|
| `/[locale]/reviews` | `/[locale]/lab` |
| `/[locale]/reviews/[id]` | `/[locale]/lab` |
| `/[locale]/compare/[pair]` | `/[locale]/services` |
| `/[locale]/metrics` | `/[locale]/services` |

---

## Development

```bash
npm install
npm run dev       # http://localhost:3000
```

### Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=https://smartworklab.store
```

### Database

Apply the v2 migration in Supabase dashboard → SQL Editor:

```bash
# supabase/migrations/20260322_smartworklab_v2.sql
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | Supabase (PostgreSQL + RLS) |
| Auth | Supabase Auth |
| i18n | `next-intl` (EN / KO / DE) |
| Deployment | Vercel |

---

## Content Series

| Series | Description |
|---|---|
| `ML Paper Reviews` | Academic paper breakdowns with implementation notes |
| `Agentic Workflows` | Multi-step AI agent system walkthroughs |
| `Spatial AI` | Geospatial ML and H3-based data processing |

---

*See [ARCHITECTURE.md](./ARCHITECTURE.md) for the full migration plan and component mapping.*
