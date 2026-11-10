# SmartWorkLab — Bilingual Engineering Research Blog

> **Live site:** [smartworklab.store](https://smartworklab.store) · **Stack:** Next.js 16.1.5 · React 19 · Supabase · Vercel · `next-intl` (EN / KO)

SmartWorkLab is an engineering research blog in English and Korean. It documents real work with measured results — currently the open-source **Mochi Sprout** Physical AI robot project (MuJoCo simulation, control, evaluation), plus a projects page and a services page. No pricing claims, no invented results, no agency tier cards.

---

## Content

The live series is **Mochi Sprout — Building an Open-Source Physical AI Robot** (KO: 모찌 새싹 — 오픈소스 피지컬 AI 로봇 만들기):

| Day | Topic | Status |
|---|---|---|
| Day 1 | First MuJoCo physics simulation (pendulum, two gravities) | Published 2026-11-06 |
| Day 2 | P, PI, PD, PID step-response comparison | Published 2026-11-06 |
| Day 3 | PID robustness: inertia, sensor noise, delay | In review (branch `publish/mochi-sprout-day03`) |
| Day 4 | — | Not started |

See [CONTENT_GUIDELINE.md](./CONTENT_GUIDELINE.md) for the editorial standard: measured results only, bilingual meaning-first writing, mandatory limitations.

---

## How publishing works

Content source of truth is **Supabase `tech_posts`** (one row per locale per article). MDX files in `content/lab/{en,ko}/` are the authoring source and are synced to the database — never the other way around.

1. Write or edit MDX (EN + KO) and any SVG figures under `public/images/lab/`.
2. Open a PR, pass typecheck + build, merge to `main` (Vercel auto-deploys).
3. Sync the new/changed MDX files to Supabase with the **targeted sync** (run from a local checkout with the service key):
   ```bash
   npx ts-node --project tsconfig.json scripts/sync-targeted.ts content/lab/en/<slug>.mdx content/lab/ko/<slug>.mdx
   ```
   The sync upserts only the named files and preserves an existing row's `published_at`.
4. Verify the live article URLs (both locales), series page, and prev/next navigation.

**Never run `npm run sync:lab`** (full sync). It syncs every MDX file and would republish articles that were deliberately deleted. See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md).

---

## Project structure

```
app/
├── [locale]/
│   ├── page.tsx              ← Homepage (hero + featured series + dynamic lab grid)
│   ├── layout.tsx            ← Locale layout (locale-aware metadata, nav, footer)
│   ├── lab/                  ← Tech blog
│   │   ├── page.tsx          ← Post listing index
│   │   ├── [slug]/page.tsx   ← Individual post (DB body_mdx + JSON-LD + prev/next)
│   │   └── series/           ← Series index + series detail
│   ├── projects/page.tsx     ← Projects (Mochi Sprout, SmartWorkLab, prototypes)
│   ├── services/page.tsx     ← Services (three areas, mailto CTA, no pricing)
│   ├── about/                ← About + methodology
│   ├── privacy/  terms/      ← Legal pages (content under owner review, see docs/legal/REVIEW-NEEDED.md)
│   ├── login/  admin/        ← Auth + admin (legacy)
│   └── reviews/ compare/ metrics/  ← Legacy routes, 301-redirected (see below)
├── api/
├── robots.ts  sitemap.ts     ← Sitemap built from published tech_posts
components/
├── lab/                      ← TechPostLayout, MarkdownRenderer (KaTeX + Prism), CodeBlock, sims
├── Navigation.tsx  Footer.tsx
content/lab/{en,ko}/          ← Article MDX (authoring source)
public/images/lab/            ← Article figures (SVG regenerated from verified data)
messages/{en,ko}.json         ← next-intl strings (EN / KO only)
scripts/
├── sync-targeted.ts          ← Targeted MDX → Supabase sync (the only supported sync)
├── sync-lab.ts               ← Full sync — DO NOT RUN
└── audit-localization.ts     ← EN/KO localization audit (all public routes)
lib/
├── supabase.ts  series.ts    ← Series slug mapping (single source of truth)
└── codeTheme.ts              ← Custom high-contrast Prism theme (WCAG AA)
```

---

## URL structure

| Route | Description |
|---|---|
| `/{locale}` | Homepage — hero + Mochi Sprout progress + lab highlights |
| `/{locale}/lab` | Tech blog listing |
| `/{locale}/lab/[slug]` | Individual deep-dive post |
| `/{locale}/lab/series` | Series index |
| `/{locale}/lab/series/[series]` | Posts filtered by series |
| `/{locale}/projects` | Projects |
| `/{locale}/services` | Services (three areas, no pricing) |
| `/{locale}/about` | About + methodology |

Locales: `en`, `ko`. German was removed in November 2026 (`/de` → 301 → `/en` was in place; the locale no longer exists).

### 301 redirects (active, `next.config.ts`)

| From | To |
|---|---|
| `/[locale]/reviews`, `/[locale]/reviews/:id` | `/[locale]/lab` |
| `/[locale]/compare/:pair` | `/[locale]/services` |
| `/[locale]/metrics` | `/[locale]/services` |

---

## SEO

- Locale-aware `generateMetadata` on homepage, articles, series, projects, services, about, and lab listing: per-locale title/description/canonical.
- Reciprocal `en`/`ko` hreflang; no German alternate.
- `BlogPosting` JSON-LD on article pages; sitemap from published `tech_posts`.
- Article `og:image` is the cover image; Day 3 uses a raster PNG (pinned to the source commit) because SVG `og:image` is unreliable on most platforms.

---

## Development

```bash
npm install
npm run dev       # http://localhost:3000
npm run lint      # eslint
npx tsc --noEmit  # typecheck
```

Local production build (dummy Supabase vars are enough for the build itself):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://dummy.supabase.co NEXT_PUBLIC_SUPABASE_ANON_KEY=dummy \
  NEXT_TURBOPACK_EXPERIMENTAL_USE_SYSTEM_TLS_CERTS=1 npm run build
```

### Environment variables

```bash
NEXT_PUBLIC_SUPABASE_URL=https://fjjptyonjjaotyebhmej.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Canonical host is hardcoded to `https://www.smartworklab.store` in the code (metadata, sitemap, robots). The apex domain 307-redirects to www at the hosting level.

---

## Database (Supabase)

| Table | State |
|---|---|
| `tech_posts` | **Live source of truth.** One row per locale per article (`slug`, `locale`, `title`, `body_mdx`, `is_published`, `published_at`, …). |
| `post_interactions` | Kept. View/like tracking for articles. |
| `expert_reports`, `products` | Emptied 2026-11-05 (old tool-review content removed). Tables still exist. |
| `agency_services` | Dead table (old agency tiers). Archiving needs a separate approved migration. |
| `lib/agents/publisher.ts` | Dead code. Do not use. |

---

## Deployment

Vercel project `smart-work-lab` auto-deploys on push to `main`. Preview deployments are behind Vercel SSO deployment protection. The Cloudflare Pages check fails on every push (legacy integration, does not affect Vercel production and does not block merges; disconnecting it is undecided).

See [ARCHITECTURE.md](./ARCHITECTURE.md) (current system state) and [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) (deploy + verify checklist).
