import { describe, it, expect } from 'vitest';
import {
  selectHomepageArticles,
  HOMEPAGE_LATEST_LIMIT,
  type HomepagePost,
} from './homepage';

function post(overrides: Partial<HomepagePost> & { slug: string }): HomepagePost {
  return {
    title: `Title for ${overrides.slug}`,
    excerpt: 'An excerpt.',
    cover_image_url: null,
    published_at: '2026-11-06T06:48:11.327324+00:00',
    read_time_min: 10,
    tags: ['Mochi Sprout'],
    locale: 'en',
    is_published: true,
    ...overrides,
  };
}

const DAY1_EN = post({
  slug: 'mochi-sprout-day01-first-mujoco-simulation',
  published_at: '2026-11-06T06:48:11.327324+00:00',
});
const DAY2_EN = post({
  slug: 'mochi-sprout-day02-feedback-control',
  published_at: '2026-11-06T06:49:11.353512+00:00',
});
const DAY3_EN = post({
  slug: 'mochi-sprout-day03-pid-robustness',
  published_at: '2026-11-10T08:03:47.299+00:00',
});
const DAY1_KO = post({
  slug: 'mochi-sprout-day01-first-mujoco-simulation',
  locale: 'ko',
  published_at: '2026-11-06T06:48:11.350596+00:00',
});
const DAY2_KO = post({
  slug: 'mochi-sprout-day02-feedback-control',
  locale: 'ko',
  published_at: '2026-11-06T06:49:11.355539+00:00',
});
const DAY3_KO = post({
  slug: 'mochi-sprout-day03-pid-robustness',
  locale: 'ko',
  published_at: '2026-11-10T08:03:48.077+00:00',
});

describe('selectHomepageArticles', () => {
  it('filters by locale and publication status', () => {
    const draft = post({ slug: 'draft-post', is_published: false });
    const { featured, latest } = selectHomepageArticles(
      [DAY1_EN, DAY2_EN, DAY3_EN, DAY1_KO, DAY2_KO, DAY3_KO, draft],
      'en'
    );
    const slugs = [featured?.slug, ...latest.map((p) => p.slug)];
    expect(slugs).not.toContain('draft-post');
    expect(slugs.every((s) => s !== undefined)).toBe(true);
    // Only EN rows survive; KO rows are excluded.
    expect(featured?.locale).toBe('en');
    expect(latest.every((p) => p.locale === 'en')).toBe(true);
  });

  it('selects the newest published article as Featured', () => {
    const { featured } = selectHomepageArticles([DAY1_EN, DAY3_EN, DAY2_EN], 'en');
    expect(featured?.slug).toBe('mochi-sprout-day03-pid-robustness');
    const { featured: koFeatured } = selectHomepageArticles(
      [DAY1_KO, DAY3_KO, DAY2_KO],
      'ko'
    );
    expect(koFeatured?.slug).toBe('mochi-sprout-day03-pid-robustness');
  });

  it('excludes Featured from Latest and orders Latest newest first', () => {
    const { featured, latest } = selectHomepageArticles(
      [DAY1_EN, DAY2_EN, DAY3_EN],
      'en'
    );
    expect(latest.map((p) => p.slug)).toEqual([
      'mochi-sprout-day02-feedback-control',
      'mochi-sprout-day01-first-mujoco-simulation',
    ]);
    expect(latest.map((p) => p.slug)).not.toContain(featured?.slug);
  });

  it('orders deterministically when published_at ties (slug ascending)', () => {
    const sameTime = '2026-11-06T06:48:11.327324+00:00';
    const a = post({ slug: 'b-article', published_at: sameTime });
    const b = post({ slug: 'a-article', published_at: sameTime });
    const c = post({ slug: 'c-article', published_at: sameTime });
    const first = selectHomepageArticles([a, b, c], 'en');
    const shuffled = selectHomepageArticles([c, a, b], 'en');
    expect(first.featured?.slug).toBe('a-article');
    expect(first.latest.map((p) => p.slug)).toEqual(['b-article', 'c-article']);
    expect(shuffled).toEqual(first);
  });

  it('handles zero published articles', () => {
    const { featured, latest } = selectHomepageArticles([], 'en');
    expect(featured).toBeNull();
    expect(latest).toEqual([]);
    const onlyDraft = selectHomepageArticles(
      [post({ slug: 'draft-post', is_published: false })],
      'en'
    );
    expect(onlyDraft.featured).toBeNull();
    expect(onlyDraft.latest).toEqual([]);
  });

  it('handles one published article', () => {
    const { featured, latest } = selectHomepageArticles([DAY1_EN], 'en');
    expect(featured?.slug).toBe('mochi-sprout-day01-first-mujoco-simulation');
    expect(latest).toEqual([]);
  });

  it('handles three published articles (Day 3 featured, Day 2 then Day 1 latest)', () => {
    const { featured, latest } = selectHomepageArticles(
      [DAY2_EN, DAY1_EN, DAY3_EN],
      'en'
    );
    expect(featured?.slug).toBe('mochi-sprout-day03-pid-robustness');
    expect(latest.map((p) => p.slug)).toEqual([
      'mochi-sprout-day02-feedback-control',
      'mochi-sprout-day01-first-mujoco-simulation',
    ]);
  });

  it('produces no duplicate cards and caps Latest at six', () => {
    const many = Array.from({ length: 8 }, (_, i) =>
      post({
        slug: `post-${String(i + 1).padStart(2, '0')}`,
        published_at: `2026-11-${String(10 - i).padStart(2, '0')}T08:00:00.000Z`,
      })
    );
    const { featured, latest } = selectHomepageArticles(many, 'en');
    expect(latest.length).toBe(HOMEPAGE_LATEST_LIMIT);
    const all = [featured?.slug, ...latest.map((p) => p.slug)];
    expect(new Set(all).size).toBe(all.length);
    expect(latest.map((p) => p.slug)).not.toContain(featured?.slug);
    // Newest first: featured is post-01 (Nov 10), latest starts with post-02.
    expect(featured?.slug).toBe('post-01');
    expect(latest[0].slug).toBe('post-02');
  });
});
