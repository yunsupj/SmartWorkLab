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
      languages: {
        'en': `https://smartworklab.store/en/lab/${slug}`,
        'ko': `https://smartworklab.store/ko/lab/${slug}`,
        'de': `https://smartworklab.store/de/lab/${slug}`,
      }
    },
  };
}

export default async function LabPostPage({ params }: Props) {
  const { locale, slug } = await params;

  if (!supabase) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-red-400 font-mono">
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

  return (
    <TechPostLayout post={post}>
      {/* SVG Simulation slot (only when post has a demo) */}


      {/* Rendered Markdown + KaTeX + Code */}
      {post.body_mdx ? (
        <MarkdownRenderer content={post.body_mdx} />
      ) : (
        <div className="text-center py-24 border border-dashed border-slate-800 rounded-xl my-8">
          <p className="text-slate-500 font-mono text-sm">Content coming soon.</p>
          <p className="text-slate-700 text-xs mt-2">Seed via Supabase admin → body_mdx field.</p>
        </div>
      )}
    </TechPostLayout>
  );
}
