import { MetadataRoute } from 'next';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://smartworklab.store';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const cookieStore = await cookies();

  // 1. Static Routes
  const routes = [
    '',
    '/about',
    '/reviews',
    '/login',
  ].map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // 2. Dynamic Review Routes (From DB)
  // Fetch products to generate review URLs
  let products: { name: string }[] = [];
  try {
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
        cookies: {
            getAll() { return cookieStore.getAll(); },
            setAll(cookiesToSet) { /* No-op for sitemap */ },
        },
        }
    );

    // Select all products (assuming public access)
    const { data } = await supabase.from('products').select('name');
    if (data) {
        products = data;
    }
  } catch (err) {
    console.error('Sitemap fetch failed:', err);
  }

  // Fallback if DB is empty or fails
  const mockTools = ['ChatGPT Teams', 'Claude 3.5 Sonnet', 'Cursor AI', 'Midjourney v6'];
  const toolNames = products.length > 0 ? products.map((p: any) => p.name) : mockTools;

  const reviewRoutes = toolNames.map((name: string) => ({
    url: `${BASE_URL}/reviews/${name.toLowerCase().replace(/\s+/g, '-')}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));

  return [...routes, ...reviewRoutes];
}
