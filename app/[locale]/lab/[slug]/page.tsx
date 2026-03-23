import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import TableOfContents from '@/components/TableOfContents';
import { Clock, Code2, Sigma, Tag, CalendarDays } from 'lucide-react';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!supabase) return {};

  const { data: post } = await supabase
    .from('tech_posts')
    .select('title, excerpt, cover_image_url')
    .eq('slug', slug)
    .eq('locale', locale)
    .eq('is_published', true)
    .single();

  if (!post) return {};

  return {
    title: `${post.title} | SmartWorkLab`,
    description: post.excerpt ?? undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      images: post.cover_image_url ? [post.cover_image_url] : [],
    },
    alternates: {
      canonical: `https://smartworklab.store/${locale}/lab/${slug}`,
    },
  };
}

export default async function LabPostPage({ params }: Props) {
  const { locale, slug } = await params;

  if (!supabase) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-red-400">
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

  // Log view interaction (fire-and-forget)
  supabase.from('post_interactions').insert({
    post_id: post.id,
    type: 'view',
  });

  const tocHeadings = (post.toc_headings as Array<{ id: string; text: string; level: number }>) ?? [];

  return (
    <div className="bg-slate-950 text-white min-h-screen">
      {/* Cover / Hero */}
      {post.cover_image_url && (
        <div
          className="w-full h-64 md:h-96 bg-cover bg-center relative"
          style={{ backgroundImage: `url(${post.cover_image_url})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950" />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col lg:flex-row gap-12">

          {/* Main Content */}
          <article className="flex-1 min-w-0 max-w-3xl">

            {/* Series + Tags */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              {post.series && (
                <span className="text-xs font-mono text-purple-400 bg-purple-950/40 border border-purple-800/40 rounded-full px-3 py-1">
                  {post.series}
                </span>
              )}
              {(post.tags as string[] | null)?.map((tag) => (
                <span key={tag} className="flex items-center gap-1 text-xs text-slate-500 bg-slate-900 border border-slate-800 rounded-full px-2 py-0.5">
                  <Tag className="w-2.5 h-2.5" /> {tag}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight tracking-tight">
              {post.title}
            </h1>

            {post.subtitle && (
              <p className="text-xl text-slate-400 mb-8 leading-relaxed">{post.subtitle}</p>
            )}

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 mb-10 pb-10 border-b border-slate-800">
              <span className="font-medium text-slate-400">{post.author}</span>
              {post.published_at && (
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="w-3.5 h-3.5" />
                  {new Date(post.published_at).toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              )}
              {post.read_time_min && (
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> {post.read_time_min} min read
                </span>
              )}
              {post.has_code && (
                <span className="flex items-center gap-1.5 text-cyan-600">
                  <Code2 className="w-3.5 h-3.5" /> Code
                </span>
              )}
              {post.has_latex && (
                <span className="flex items-center gap-1.5 text-yellow-600">
                  <Sigma className="w-3.5 h-3.5" /> LaTeX
                </span>
              )}
            </div>

            {/* Body — placeholder for MDX renderer (Phase 4) */}
            {post.body_mdx ? (
              <div
                className="prose prose-invert prose-slate prose-lg max-w-none
                           prose-headings:font-bold prose-headings:tracking-tight
                           prose-code:text-cyan-400 prose-code:bg-slate-900 prose-code:rounded prose-code:px-1
                           prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-800
                           prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:underline"
                dangerouslySetInnerHTML={{ __html: post.body_mdx }}
              />
            ) : (
              <div className="text-center py-24 border border-dashed border-slate-800 rounded-xl">
                <p className="text-slate-500 font-mono text-sm">Content rendering pipeline coming in Phase 4.</p>
                <p className="text-slate-700 text-xs mt-2">(MDX + KaTeX + Shiki)</p>
              </div>
            )}
          </article>

          {/* Sidebar — Table of Contents */}
          {tocHeadings.length > 0 && (
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-24">
                <TableOfContents headings={tocHeadings} />
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
