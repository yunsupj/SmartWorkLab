import TableOfContents from '@/components/TableOfContents';
import { Clock, Code2, Sigma, Tag, CalendarDays, Layers, ExternalLink, FlaskConical } from 'lucide-react';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { seriesSlug } from '@/lib/series';

interface Heading { id: string; text: string; level: number; }

interface TechPost {
  id: string;
  slug: string;
  locale: string;
  title: string;
  subtitle?: string | null;
  excerpt?: string | null;
  cover_image_url?: string | null;
  tags?: string[] | null;
  series?: string | null;
  has_latex: boolean;
  has_code: boolean;
  has_svg_demo: boolean;
  author: string;
  published_at?: string | null;
  updated_at?: string | null;
  read_time_min?: number | null;
  toc_headings?: Heading[] | null;
  view_count?: number;
}

interface TechPostLayoutProps {
  post: TechPost;
  /** Rendered body content (from MarkdownRenderer or MDX) */
  children: React.ReactNode;
  /** Adjacent articles in the same series (by publication date). */
  prevPost?: { slug: string; title: string } | null;
  nextPost?: { slug: string; title: string } | null;
}

/**
 * TechPostLayout — full-page layout for /lab/[slug] posts.
 * Handles: cover image, hero header, meta row (badges),
 * two-column layout (article + TOC sidebar), breadcrumb nav.
 */
export default async function TechPostLayout({ post, children, prevPost, nextPost }: TechPostLayoutProps) {
  const t = await getTranslations('Lab');
  const tocHeadings = post.toc_headings ?? [];
  const hasSidebar = tocHeadings.length > 0;

  return (
    <div className="bg-[#F7F7F4] text-[#1C2321] min-h-screen">

      {/* Cover Image with gradient fade */}
      {post.cover_image_url && (
        <div className="relative w-full h-52 md:h-80 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center scale-105"
            style={{ backgroundImage: `url(${post.cover_image_url})`, filter: 'blur(1px)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#F7F7F4]/40 via-[#F7F7F4]/60 to-[#F7F7F4]" />
        </div>
      )}

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 pt-8">
        <nav className="flex items-center gap-2 text-xs text-[#8A938E] font-mono mb-8">
          <Link href="/" className="hover:text-[#66716C] transition-colors">{t('home')}</Link>
          <span>/</span>
          <Link href={`/${post.locale}/lab`} className="hover:text-[#66716C] transition-colors">{t('the_lab')}</Link>
          {post.series && (
            <>
              <span>/</span>
              <Link
                href={`/${post.locale}/lab/series/${seriesSlug(post.series)}`}
                className="hover:text-[#4C6B59] transition-colors"
              >
                {post.series}
              </Link>
            </>
          )}
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-24">
        <div className={`flex gap-16 ${hasSidebar ? 'flex-col lg:flex-row' : 'flex-col'}`}>

          {/* ─── Main Article ─── */}
          <article className="flex-1 min-w-0">

            {/* Series + capability badges */}
            <div className="flex flex-wrap items-center gap-2.5 mb-5">
              {post.series && (
                <span className="inline-flex items-center gap-1.5 text-xs font-mono text-[#4C6B59] bg-[#DCE8DF]/60 border border-[#4C6B59]/30 rounded-full px-3 py-1">
                  <Layers className="w-3 h-3" />
                  {post.series}
                </span>
              )}
              {post.has_svg_demo && (
                <span className="inline-flex items-center gap-1.5 text-xs font-mono text-[#8A6D1B] bg-amber-50 border border-amber-200 rounded-full px-3 py-1">
                  <FlaskConical className="w-3 h-3" />
                  {t('interactive_demo')}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight tracking-tight text-[#1C2321]">
              {post.title}
            </h1>

            {post.subtitle && (
              <p className="text-xl text-[#66716C] mb-8 leading-relaxed">{post.subtitle}</p>
            )}

            {/* Meta strip */}
            <div className="flex flex-wrap items-center gap-5 text-sm text-[#8A938E] mb-8 pb-8 border-b border-[#E4E7E2]">
              <span className="font-semibold text-[#66716C]">{post.author}</span>

              {post.published_at && (
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="w-3.5 h-3.5" />
                  {new Date(post.published_at).toLocaleDateString(post.locale, {
                    year: 'numeric', month: 'long', day: 'numeric',
                  })}
                </span>
              )}
              {post.read_time_min && (
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {t('min_read', { minutes: post.read_time_min })}
                </span>
              )}
              {post.has_code && (
                <span className="flex items-center gap-1.5 text-[#4C6B59]/80">
                  <Code2 className="w-3.5 h-3.5" /> Code
                </span>
              )}
              {post.has_latex && (
                <span className="flex items-center gap-1.5 text-[#8A6D1B]">
                  <Sigma className="w-3.5 h-3.5" /> LaTeX
                </span>
              )}
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-10">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 text-xs text-[#8A938E] bg-[#FFFFFF] border border-[#E4E7E2] rounded-full px-2.5 py-1 hover:border-[#D5DAD3] transition-colors"
                  >
                    <Tag className="w-2.5 h-2.5" /> {tag}
                  </span>
                ))}
              </div>
            )}

            {/* ── Body Content ── */}
            {children}

            {/* Previous / next in series */}
            {(prevPost || nextPost) && (
              <nav className="mt-16 pt-8 border-t border-[#E4E7E2] grid sm:grid-cols-2 gap-4" aria-label="Article navigation">
                {prevPost ? (
                  <Link href={`/${post.locale}/lab/${prevPost.slug}`} className="group rounded-xl border border-[#E4E7E2] bg-[#FFFFFF] p-4 hover:border-[#4C6B59]/60 transition-colors">
                    <span className="block text-xs font-mono text-[#8A938E] uppercase tracking-widest mb-1">← {t('prev')}</span>
                    <span className="block text-sm font-bold text-[#1C2321] leading-snug">{prevPost.title}</span>
                  </Link>
                ) : <span />}
                {nextPost && (
                  <Link href={`/${post.locale}/lab/${nextPost.slug}`} className="group rounded-xl border border-[#E4E7E2] bg-[#FFFFFF] p-4 text-right hover:border-[#4C6B59]/60 transition-colors">
                    <span className="block text-xs font-mono text-[#8A938E] uppercase tracking-widest mb-1">{t('next')} →</span>
                    <span className="block text-sm font-bold text-[#1C2321] leading-snug">{nextPost.title}</span>
                  </Link>
                )}
              </nav>
            )}

            {/* Footer: Back to Lab */}
            <div className="mt-8 pt-8 border-t border-[#E4E7E2] flex items-center justify-between">
              <Link
                href={`/${post.locale}/lab`}
                className="text-sm text-[#8A938E] hover:text-[#4C6B59] transition-colors flex items-center gap-2 font-mono"
              >
                ← {t('back_to_lab')}
              </Link>
              {post.updated_at && (
                <p className="text-xs text-[#66716C] font-mono">
                  {t('updated')} {new Date(post.updated_at).toLocaleDateString(post.locale, {
                    year: 'numeric', month: 'long', day: 'numeric',
                  })}
                </p>
              )}
            </div>
          </article>

          {/* ─── TOC Sidebar ─── */}
          {hasSidebar && (
            <aside className="hidden lg:block w-60 flex-shrink-0">
              <div className="sticky top-24 space-y-6">
                <TableOfContents headings={tocHeadings} />

                {/* Series card in sidebar */}
                {post.series && (
                  <div className="rounded-xl border border-[#E4E7E2] bg-[#FFFFFF] p-4">
                    <p className="text-xs font-bold text-[#1C2321] mb-1">{t('series_label')}</p>
                    <p className="text-xs text-[#66716C] mb-3 leading-relaxed">
                      {post.series}
                    </p>
                    <Link
                      href={`/${post.locale}/lab/series/${seriesSlug(post.series)}`}
                      className="flex items-center gap-1 text-xs text-[#4C6B59] hover:underline font-bold transition-colors"
                    >
                      {t('all_in_series')} <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                )}
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
