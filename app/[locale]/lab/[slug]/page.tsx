import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import TechPostLayout from '@/components/lab/TechPostLayout';
import MarkdownRenderer from '@/components/lab/MarkdownRenderer';
import SimulationSlot from '@/components/lab/SimulationSlot';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!supabase) return {};

  const { data: post } = await supabase
    .from('tech_posts')
    .select('title, excerpt, cover_image_url, tags, series')
    .eq('slug', slug)
    .eq('locale', locale)
    .eq('is_published', true)
    .single();

  if (!post) return {};

  // hreflang only for locales where this article actually exists.
  const { data: translations } = await supabase
    .from('tech_posts')
    .select('locale')
    .eq('slug', slug)
    .eq('is_published', true)
    .in('locale', ['en', 'ko']);
  const languages: Record<string, string> = {};
  for (const t of translations ?? []) {
    languages[t.locale] = `https://smartworklab.store/${t.locale}/lab/${slug}`;
  }

  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    keywords: post.tags ?? undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      images: post.cover_image_url ? [post.cover_image_url] : [],
      type: 'article',
    },
    alternates: {
      canonical: `https://smartworklab.store/${locale}/lab/${slug}`,
      languages,
    },
  };
}

export default async function LabPostPage({ params }: Props) {
  const { locale, slug } = await params;

  if (!supabase) {
    return (
      <div className="min-h-screen bg-[#F7F7F4] flex items-center justify-center text-red-400 font-mono">
        Database connection missing.
      </div>
    );
  }

  const { data: post, error } = await supabase
    .from('tech_posts')
    .select('*')
    .eq('slug', slug)
    .eq('locale', locale)
    .eq('is_published', true)
    .single();

  if (error || !post) notFound();

  // Fire-and-forget view interaction
  supabase.from('post_interactions').insert({ post_id: post.id, type: 'view' });

  // Previous / next article within the same series (by publication date).
  let prevPost: { slug: string; title: string } | null = null;
  let nextPost: { slug: string; title: string } | null = null;
  if (post.series) {
    const { data: siblings } = await supabase
      .from('tech_posts')
      .select('slug, title, published_at')
      .eq('series', post.series)
      .eq('locale', locale)
      .eq('is_published', true)
      .order('published_at', { ascending: true });
    const idx = (siblings ?? []).findIndex((p) => p.slug === post.slug);
    if (idx > 0) prevPost = siblings![idx - 1];
    if (idx >= 0 && idx < (siblings?.length ?? 0) - 1) nextPost = siblings![idx + 1];
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt ?? undefined,
    author: { '@type': 'Person', name: post.author },
    datePublished: post.published_at ?? undefined,
    dateModified: post.updated_at ?? undefined,
    mainEntityOfPage: `https://smartworklab.store/${locale}/lab/${slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TechPostLayout post={post} prevPost={prevPost} nextPost={nextPost}>
      {/* SVG Simulation slot (only when post has a demo) */}


      {/* Rendered Markdown + KaTeX + Code */}
      {post.body_mdx ? (
        <MarkdownRenderer content={post.body_mdx} />
      ) : (
        <div className="text-center py-24 border border-dashed border-[#E4E7E2] rounded-xl my-8">
          <p className="text-[#8A938E] font-mono text-sm">Content coming soon.</p>
          <p className="text-[#66716C] text-xs mt-2">Seed via Supabase admin → body_mdx field.</p>
        </div>
      )}
      </TechPostLayout>
    </>
  );
}
