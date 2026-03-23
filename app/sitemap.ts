import { MetadataRoute } from 'next';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://smartworklab.store';
const LOCALES = ['en', 'ko', 'de'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const cookieStore = await cookies();

  // ---------------------------------------------------------------------------
  // 1. Static routes (no locale prefix — Next.js middleware handles it)
  // NOTE: /reviews, /metrics, /compare intentionally excluded (301 redirect,
  //       must not appear in sitemap per Google guidelines for 301'd pages)
  // ---------------------------------------------------------------------------
  const staticPaths = ['', '/about', '/lab', '/services', '/login'];

  const staticRoutes = LOCALES.flatMap((locale) =>
    staticPaths.map((path) => ({
      url: `${BASE_URL}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: path === '' ? 1.0 : path === '/lab' ? 0.9 : 0.8,
    }))
  );

  // ---------------------------------------------------------------------------
  // 2. Dynamic Lab Post Routes (from tech_posts table)
  // Only include is_published = true entries
  // ---------------------------------------------------------------------------
  let labRoutes: MetadataRoute.Sitemap = [];
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll(); },
          setAll() { /* no-op for sitemap */ },
        },
      }
    );

    const { data: posts } = await supabase
      .from('tech_posts')
      .select('slug, locale, updated_at, published_at')
      .eq('is_published', true)
      .order('published_at', { ascending: false });

    if (posts) {
      labRoutes = posts.map((post: any) => ({
        url: `${BASE_URL}/${post.locale}/lab/${post.slug}`,
        lastModified: new Date(post.updated_at || post.published_at),
        changeFrequency: 'monthly' as const,
        priority: 0.9,
      }));
    }
  } catch (err) {
    console.error('Sitemap: tech_posts fetch failed:', err);
  }

  return [...staticRoutes, ...labRoutes];
}
