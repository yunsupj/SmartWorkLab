# View / Like Tracking — Currently Nonfunctional (Future Issue)

Status: observed 2026-11-10, not fixed by the homepage simplification
(`simplify/homepage-selection`). The homepage no longer depends on these
columns, so nothing on the site is broken by this. Do not build new features
on `view_count` / `like_count` until this is resolved.

## What was observed

- `tech_posts.view_count` and `tech_posts.like_count` are `0` on every row
  (Day 1/2/3 × EN/KO), even though Day 1 and Day 2 have been live and viewed
  since 2026-11-06.
- `post_interactions` contains **0 rows**.
- `app/[locale]/lab/[slug]/page.tsx` fires a view insert on every article
  render, but it is fire-and-forget (not awaited, error ignored) through the
  anon client:
  `supabase.from('post_interactions').insert({ post_id: post.id, type: 'view' })`.
- Nothing aggregates `post_interactions` into `tech_posts.view_count`, and no
  like interaction is wired up anywhere in the codebase.

## Likely cause (unverified)

The anon role probably has no INSERT policy on `post_interactions` (RLS), so
every view insert fails silently. Separately, even if inserts landed, no
trigger or job rolls them up into `tech_posts.view_count` / `like_count`.

## Decision needed before any fix

1. Do we want view/like tracking at all? (Privacy, noise, and maintenance
   cost vs. editorial value.)
2. If yes: add an anon INSERT policy on `post_interactions` (or move the
   insert to the service-role client), add an aggregation path into
   `tech_posts` (trigger or scheduled rollup), and verify counts move on a
   real article view. Then the homepage could rank by engagement again — but
   only if an explicit product decision says so.
3. If no: leave the columns and the empty `post_interactions` table alone
   (do not delete historical records), and remove the dead insert from the
   article page so it stops attempting a write on every view.

## Related

- Homepage selection (`lib/homepage.ts`) intentionally ignores
  `view_count` / `like_count` and selects by `published_at` instead.
- `docs/legal/REVIEW-NEEDED.md` — the legal docs still describe
  discontinued services; any tracking decision should be checked against
  the privacy policy before shipping.
