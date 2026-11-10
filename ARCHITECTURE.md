# ARCHITECTURE.md — SmartWorkLab (current state)

> **Status:** current as of November 2026. This document describes the site as it is.
> **History note:** the March 2026 "SmartWorkLab 2.0 pivot" plan (AI tool-review site → expert blog + B2B agency) is superseded. The pivot happened, then the site was rebuilt again in November 2026 into a minimal bilingual engineering journal. The old pivot text is not preserved here; git history has it.

---

## 0. What the site is

A bilingual (EN / KO) engineering research blog. One live series — **Mochi Sprout**, an open-source Physical AI robot built in public (MuJoCo simulation → control → evaluation → hardware, eventually). Plus a projects page and a services page (three areas, mailto CTA, no pricing, no tier cards, no SOC 2 claims).

Design: light editorial theme only. Background `#F7F7F4`, surface `#FFFFFF`, ink `#1C2321`, secondary `#66716C`, accent `#4C6B59`, borders `#E4E7E2`. Geist + system Korean stacks. Navigation: Articles / Projects / Services / About + EN/KO switcher.

---

## 1. Tech stack

| Layer | Current |
|---|---|
| Framework | Next.js 16.1.5 (App Router + `[locale]` segment), React 19.2.3 |
| Language | TypeScript |
| Styling | Tailwind CSS (v4-era setup; see `app/globals.css`) |
| Database | Supabase (PostgreSQL + RLS). Project: `fjjptyonjjaotyebhmej.supabase.co` |
| Auth | Supabase Auth (login/admin routes are legacy) |
| i18n | `next-intl` 4.7.0, locales `['en', 'ko']` (`i18n/routing.ts`). German removed Nov 2026. |
| Deployment | Vercel (`smart-work-lab`). Preview deployments behind SSO deployment protection. |
| Content | MDX authoring source in `content/lab/{en,ko}/`, synced to Supabase `tech_posts` |

---

## 2. Route tree

```
app/
├── [locale]/
│   ├── page.tsx                  ← Homepage: hero, featured Mochi Sprout card, dynamic lab grid
│   ├── layout.tsx                ← Locale layout: locale-aware metadata, Navigation, Footer
│   ├── lab/
│   │   ├── page.tsx              ← Post listing (from tech_posts, locale-filtered)
│   │   ├── [slug]/page.tsx       ← Article: DB body_mdx → MarkdownRenderer, JSON-LD, prev/next
│   │   └── series/
│   │       ├── page.tsx          ← Series index
│   │       └── [series]/page.tsx ← Series detail (slug via lib/series.ts)
│   ├── projects/page.tsx         ← Projects with honest status labels
│   ├── services/page.tsx         ← Services: three areas, mailto CTA
│   ├── about/page.tsx            ← About + methodology (localized)
│   ├── privacy/page.tsx  terms/page.tsx  ← Legal pages (content under owner review)
│   ├── login/page.tsx  admin/page.tsx    ← Legacy auth/admin
│   ├── reviews/  compare/  metrics/      ← Legacy routes, 301-redirected (next.config.ts)
│   ├── error.tsx  loading.tsx
├── api/                          ← API routes
├── robots.ts  sitemap.ts         ← Sitemap from published tech_posts
middleware.ts                    ← next-intl routing
```

`next.config.ts` 301s: `/[locale]/reviews` and `/[locale]/reviews/:id` → `/[locale]/lab`; `/[locale]/compare/:pair` → `/[locale]/services`; `/[locale]/metrics` → `/[locale]/services`.

---

## 3. Database schema (Supabase)

### 3.1 `tech_posts` — live source of truth

One row per locale per article. Key fields: `slug`, `locale` (`en`/`ko`), `title`, `subtitle`, `excerpt`, `cover_image_url`, `body_mdx`, `tags`, `series`, `has_latex`, `has_code`, `read_time_min`, `author`, `published_at`, `updated_at`, `is_published`, `view_count`, `like_count`. The article page renders only rows with `is_published = true`; prev/next is computed within the same `series`, ordered by `published_at`.

### 3.2 Other tables

| Table | State |
|---|---|
| `post_interactions` | Kept. `post_id`, `type` (`view`/`like`/…), `created_at`. Article pages insert a `view` row. |
| `expert_reports`, `products` | Emptied 2026-11-05. Tables still exist; no rows. |
| `agency_services` | Dead (old agency tiers). Archiving needs a separate approved migration — do not touch without one. |

`lib/agents/publisher.ts` is dead code. Do not use it.

---

## 4. Content pipeline

```
MDX (content/lab/{en,ko}/)  →  PR + typecheck + build  →  merge to main
        →  targeted sync (scripts/sync-targeted.ts, user-run, service key)
        →  Supabase tech_posts  →  Vercel production renders the article
```

- **Never run `npm run sync:lab`** (full sync). It syncs all MDX and `is_published` defaults to true, which would republish deliberately deleted articles. Always use `scripts/sync-targeted.ts` with explicit files, in publication order (earlier articles first, so `published_at` ordering stays correct). The targeted sync preserves an existing row's `published_at`.
- Figures: PNG originals stay in the source repo (e.g. mochi-sprout `experiments/`); site figures are SVG regenerated from the verified data (`public/images/lab/`). Cover `og:image` uses a raster PNG where SVG is unreliable (Day 3 cover is the committed PNG, pinned to its source commit).
- Article rendering: `app/[locale]/lab/[slug]/page.tsx` fetches the row, `components/lab/TechPostLayout.tsx` renders the cover (CSS `background-image`) + meta strip, `components/lab/MarkdownRenderer.tsx` renders MDX (ReactMarkdown + remark-math + rehype-katex + Prism via `react-syntax-highlighter` with the custom theme in `lib/codeTheme.ts`, WCAG AA). Code-block styling: no `prose-code:*` utilities on the container (they leak into fenced blocks — see PR #6); inline code is styled explicitly in the renderer.
- Series: `lib/series.ts` is the single source of truth — `seriesSlug()` maps both `'Mochi Sprout'` and `'모찌 새싹'` to `'mochi-sprout'`.

---

## 5. i18n

- Locales `en`, `ko` only. Strings in `messages/en.json` / `messages/ko.json` (namespaces: `Home`, `Lab`, `Footer`, …).
- Dates use the page locale (`toLocaleDateString(locale, { year, month: 'long', day })`); the homepage `formatDate()` is locale-aware. Read-time labels use `Lab.min_read` (`{minutes} min read` / `{minutes}분 읽기`).
- `scripts/audit-localization.ts` fetches all public routes in EN+KO and flags untranslated UI strings (allowlist for brands/code; exit 1 on failure).

---

## 6. SEO

- `generateMetadata` is locale-aware on homepage, articles, series (index + detail), lab listing, projects, services, and about: per-locale title/description/canonical + reciprocal `en`/`ko` hreflang. No German alternate anywhere.
- Article pages: `og:image` from `cover_image_url`, `og:locale` (`en_US`/`ko_KR`), `og:url` = canonical article URL, `BlogPosting` JSON-LD (headline, description, author, `datePublished`, `dateModified`).
- `sitemap.ts` lists published `tech_posts` only; `robots.ts` is permissive.

---

## 7. Deployment

- Vercel auto-deploys on push to `main`. Verify via production (preview deployments are behind SSO; a `302 → vercel.com/sso-api` on a preview URL is expected).
- Local build/test: dummy Supabase env vars + `NEXT_TURBOPACK_EXPERIMENTAL_USE_SYSTEM_TLS_CERTS=1 npm run build`; `npx tsc --noEmit`. Kill stale `next-server` processes on ports 3100/3200 if they squat.
- The Cloudflare Pages check fails on every push (legacy integration). It does not affect Vercel production and does not block merges. Disconnecting it is undecided — do not disconnect without approval.

---

## 8. Known issues / legacy

- Legal docs (`docs/legal/`) still describe the discontinued ROI / Discord-login / Expert Lab / Scout Agent service. See `docs/legal/REVIEW-NEEDED.md` — owner review required; do not rewrite legal claims without factual review. (One safe fix applied: broken `mailto:[EMAIL_ADDRESS]` → `mailto:info@yuunchloe.com`.)
- `agency_services` table and `lib/agents/publisher.ts` are dead; archiving needs an approved migration plan.
- `app/[locale]/reviews/`, `compare/`, `metrics/` routes and `lib/agents/analyst.ts` are legacy code behind 301s. Do not build on them.
- `/og-image.jpg` referenced by the old layout metadata does not exist; the layout no longer references it. There is no site-wide raster OG image yet — article covers carry their own `og:image`.
