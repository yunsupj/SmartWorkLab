/**
 * Series slug helpers — single source of truth for series URLs.
 *
 * 'mochi-sprout' is the stable alias for the Mochi Sprout series in BOTH
 * locales: the English name contains 'Mochi Sprout', the Korean name
 * contains '모찌 새싹'. Any other name is slugified (lowercased,
 * punctuation stripped, spaces → hyphens).
 *
 * Never slugify a series name inline in a component — the naive
 * `toLowerCase().replace(/\s+/g, '-')` transform produces a long slug
 * (e.g. 'mochi-sprout-—-building-...') that matches nothing and renders
 * an empty series page.
 */
export function seriesSlug(name: string): string {
  if (name.includes('Mochi Sprout') || name.includes('모찌 새싹')) return 'mochi-sprout';
  return name
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .trim()
    .replace(/\s+/g, '-');
}

export function matchesSeries(name: string | null, param: string): boolean {
  if (!name) return false;
  return seriesSlug(name) === param;
}

/** True when the series is the Mochi Sprout series (either locale). */
export function isMochiSproutSeries(name: string | null): boolean {
  if (!name) return false;
  return name.includes('Mochi Sprout') || name.includes('모찌 새싹');
}
