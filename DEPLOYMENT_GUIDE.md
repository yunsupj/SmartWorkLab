# SmartWorkLab Deployment Guide

Deployment is **Vercel**. Cloudflare Pages is a legacy integration that is no longer used (see §4).

## 1. Where it runs

- **Production:** https://smartworklab.store (also https://www.smartworklab.store)
- **Vercel project:** `smart-work-lab` — auto-deploys on push to `main`.
- **Preview deployments:** behind Vercel SSO deployment protection. A `302 → vercel.com/sso-api` on a preview URL is expected, not an error. Verify against production or a local build instead.

## 2. Environment variables

Set in Vercel (production + preview):

| Key | Value / notes |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://fjjptyonjjaotyebhmej.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `NEXT_PUBLIC_SITE_URL` | `https://smartworklab.store` |

Local builds can use dummy Supabase values (the build itself does not need a live database):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://dummy.supabase.co NEXT_PUBLIC_SUPABASE_ANON_KEY=dummy \
  NEXT_TURBOPACK_EXPERIMENTAL_USE_SYSTEM_TLS_CERTS=1 npm run build
```

## 3. Deploy flow

1. Push to `main` (directly or by merging a PR). Vercel builds and deploys automatically.
2. Wait for the production deployment to report READY.
3. Verify on production (see §5). Do not assume a merge equals a correct deploy.

Useful local checks before pushing:

```bash
npx tsc --noEmit   # typecheck
npm run lint       # eslint
npm run build      # production build (use the dummy-env command above)
npx ts-node --project tsconfig.json scripts/audit-localization.ts  # EN/KO audit (needs a live URL)
```

If a local `next-server` process squats on port 3100/3200, kill it before starting a dev server.

## 4. Cloudflare Pages (legacy — do not use)

The old guide recommended Cloudflare Pages (`@cloudflare/next-on-pages`, edge runtime). That integration is legacy: its check fails on every push. It does not affect Vercel production and does not block merges. **Do not disconnect it without explicit approval** (undecided), and do not follow the old Cloudflare instructions.

## 5. Database and content sync

- Content source of truth is Supabase `tech_posts`. Article pages render only rows with `is_published = true`.
- Sync new/changed MDX with the **targeted sync only**:
  ```bash
  npx ts-node --project tsconfig.json scripts/sync-targeted.ts content/lab/en/<slug>.mdx content/lab/ko/<slug>.mdx
  ```
  Run from a local checkout with the service key. It upserts only the named files, preserves an existing row's `published_at`, and upserts by `(locale, slug)` (no duplicates).
- **Never run `npm run sync:lab`** (full sync): it syncs every MDX file and would republish deliberately deleted articles.
- Current DB state: `tech_posts` live; `post_interactions` kept; `expert_reports` and `products` emptied 2026-11-05; `agency_services` dead (archiving needs an approved migration).

## 6. Post-deploy verification

1. Homepage `/en` and `/ko`: hero copy, featured series card, lab grid links (server-rendered).
2. New/changed article URLs in both locales: HTTP 200, correct title/excerpt, figures render, code blocks readable (dark background, no white strips), tables scroll, KaTeX renders.
3. Series page: all articles listed in publication order; prev/next navigation works between them.
4. Metadata: per-locale canonical, reciprocal `en`/`ko` hreflang, no German alternate, `og:image` present, `BlogPosting` JSON-LD.
5. `sitemap.xml` includes new slugs; `robots.txt` serves.
6. Old routes still 301: `/[locale]/reviews` → `/lab`, `/[locale]/compare/:pair` → `/services`, `/[locale]/metrics` → `/services`.
