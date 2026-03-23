import TableOfContents from '@/components/TableOfContents';
import { Clock, Code2, Sigma, Tag, CalendarDays, Layers, ExternalLink, FlaskConical } from 'lucide-react';
import Link from 'next/link';

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
}

/**
 * TechPostLayout — full-page layout for /lab/[slug] posts.
 * Handles: cover image, hero header, meta row (badges),
 * two-column layout (article + TOC sidebar), breadcrumb nav.
 */
export default function TechPostLayout({ post, children }: TechPostLayoutProps) {
  const tocHeadings = post.toc_headings ?? [];
  const hasSidebar = tocHeadings.length > 0;

  return (
    <div className="bg-slate-950 text-white min-h-screen">

      {/* Cover Image with gradient fade */}
      {post.cover_image_url && (
        <div className="relative w-full h-52 md:h-80 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center scale-105"
            style={{ backgroundImage: `url(${post.cover_image_url})`, filter: 'blur(1px)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/60 to-slate-950" />
        </div>
      )}

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 pt-8">
        <nav className="flex items-center gap-2 text-xs text-slate-500 font-mono mb-8">
          <Link href="/" className="hover:text-slate-300 transition-colors">Home</Link>
          <span>/</span>
          <Link href={`/${post.locale}/lab`} className="hover:text-slate-300 transition-colors">The Lab</Link>
          {post.series && (
            <>
              <span>/</span>
              <Link
                href={`/${post.locale}/lab/series/${post.series.toLowerCase().replace(/\s+/g, '-')}`}
                className="hover:text-cyan-400 transition-colors"
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
                <span className="inline-flex items-center gap-1.5 text-xs font-mono text-purple-400 bg-purple-950/40 border border-purple-800/40 rounded-full px-3 py-1">
                  <Layers className="w-3 h-3" />
                  {post.series}
                </span>
              )}
              {post.has_svg_demo && (
                <span className="inline-flex items-center gap-1.5 text-xs font-mono text-amber-400 bg-amber-950/40 border border-amber-800/40 rounded-full px-3 py-1">
                  <FlaskConical className="w-3 h-3" />
                  Interactive Demo
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight tracking-tight text-white">
              {post.title}
            </h1>

            {post.subtitle && (
              <p className="text-xl text-slate-400 mb-8 leading-relaxed">{post.subtitle}</p>
            )}

            {/* Meta strip */}
            <div className="flex flex-wrap items-center gap-5 text-sm text-slate-500 mb-8 pb-8 border-b border-slate-800">
              <span className="font-semibold text-slate-300">{post.author}</span>

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
                  {post.read_time_min} min read
                </span>
              )}
              {post.has_code && (
                <span className="flex items-center gap-1.5 text-cyan-500/80">
                  <Code2 className="w-3.5 h-3.5" /> Code
                </span>
              )}
              {post.has_latex && (
                <span className="flex items-center gap-1.5 text-yellow-500/80">
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
                    className="flex items-center gap-1 text-xs text-slate-500 bg-slate-900 border border-slate-800 rounded-full px-2.5 py-1 hover:border-slate-700 transition-colors"
                  >
                    <Tag className="w-2.5 h-2.5" /> {tag}
                  </span>
                ))}
              </div>
            )}

            {/* ── Body Content ── */}
            {children}

            {/* Footer: Back to Lab */}
            <div className="mt-16 pt-8 border-t border-slate-800 flex items-center justify-between">
              <Link
                href={`/${post.locale}/lab`}
                className="text-sm text-slate-500 hover:text-cyan-400 transition-colors flex items-center gap-2 font-mono"
              >
                ← Back to The Lab
              </Link>
              {post.updated_at && (
                <p className="text-xs text-slate-700 font-mono">
                  Updated {new Date(post.updated_at).toLocaleDateString()}
                </p>
              )}
            </div>
          </article>

          {/* ─── TOC Sidebar ─── */}
          {hasSidebar && (
            <aside className="hidden lg:block w-60 flex-shrink-0">
              <div className="sticky top-24 space-y-6">
                <TableOfContents headings={tocHeadings} />

                {/* CTA card in sidebar */}
                <div className="rounded-xl border border-green-800/40 bg-green-950/20 p-4">
                  <p className="text-xs font-bold text-green-400 mb-1">Need this built?</p>
                  <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                    We implement ML systems like this for clients.
                  </p>
                  <Link
                    href={`/${post.locale}/services`}
                    className="flex items-center gap-1 text-xs text-green-400 hover:text-green-300 font-bold transition-colors"
                  >
                    View Services <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
