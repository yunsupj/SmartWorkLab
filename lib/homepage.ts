/**
 * Homepage article selection — deterministic, no engagement data.
 *
 * Featured = the most recently published article in the current locale.
 * Latest = the remaining published articles, newest first (max 6).
 *
 * Ordering: published_at descending, ties broken by slug ascending, so the
 * result is identical on every render for the same input. A missing
 * published_at is treated as the epoch and sorts last.
 *
 * The Supabase query already filters is_published + locale, but this
 * function re-applies both filters so its contract is testable in isolation
 * and stays correct if the caller ever passes unfiltered rows.
 */

export interface HomepagePost {
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image_url: string | null;
  published_at: string | null;
  read_time_min: number | null;
  tags: string[] | null;
  locale: string;
  is_published: boolean;
}

export interface HomepageSelection {
  featured: HomepagePost | null;
  latest: HomepagePost[];
}

/** Maximum number of cards in the Latest Articles section. */
export const HOMEPAGE_LATEST_LIMIT = 6;

export function selectHomepageArticles(
  posts: readonly HomepagePost[],
  locale: string
): HomepageSelection {
  const sorted = posts
    .filter((p) => p.is_published && p.locale === locale)
    .slice()
    .sort((a, b) => {
      const timeA = a.published_at ? new Date(a.published_at).getTime() : 0;
      const timeB = b.published_at ? new Date(b.published_at).getTime() : 0;
      if (timeB !== timeA) return timeB - timeA;
      if (a.slug < b.slug) return -1;
      if (a.slug > b.slug) return 1;
      return 0;
    });

  const [featured, ...rest] = sorted;
  return {
    featured: featured ?? null,
    latest: rest.slice(0, HOMEPAGE_LATEST_LIMIT),
  };
}
