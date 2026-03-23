import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { ArrowRight, Clock, Code2, FlaskConical, Sigma } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

interface TechPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  series: string | null;
  tags: string[] | null;
  read_time_min: number | null;
  has_latex: boolean;
  has_code: boolean;
  published_at: string | null;
}

export default async function LabPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  let posts: TechPost[] = [];

  if (supabase) {
    const { data } = await supabase
      .from('tech_posts')
      .select('id, slug, title, excerpt, series, tags, read_time_min, has_latex, has_code, published_at')
      .eq('is_published', true)
      .eq('locale', locale)
      .order('published_at', { ascending: false });

    if (data) posts = data;
  }

  return (
    <div className="bg-slate-950 text-white min-h-screen">
      {/* Hero */}
      <header className="pt-24 pb-16 text-center max-w-4xl mx-auto px-6">
        <div className="inline-block px-4 py-1.5 mb-6 text-xs font-mono text-cyan-400 border border-cyan-500/30 rounded-full bg-cyan-950/30 uppercase tracking-widest">
          SmartWorkLab · Deep Dives
        </div>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
          The Lab
        </h1>
        <p className="text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto">
          Real ML implementations, paper breakdowns, and agentic workflow walkthroughs — written by engineers, for engineers.
        </p>
      </header>

      {/* Post Grid */}
      <main className="max-w-7xl mx-auto px-6 pb-24">
        {posts.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-slate-800 rounded-2xl">
            <FlaskConical className="w-12 h-12 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-500 font-mono text-sm">No posts published yet.</p>
            <p className="text-slate-700 text-xs mt-2">Run the seed script or publish via admin.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/${locale}/lab/${post.slug}`}
                className="group block bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-xl p-6 hover:border-cyan-500/30 transition-all hover:-translate-y-1 relative overflow-hidden"
              >
                {/* Spotlight */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none group-hover:bg-cyan-500/10 transition-colors" />

                {/* Series badge */}
                {post.series && (
                  <span className="inline-block text-xs font-mono text-purple-400 bg-purple-950/40 border border-purple-800/40 rounded-full px-3 py-1 mb-4">
                    {post.series}
                  </span>
                )}

                <h2 className="text-lg font-bold text-white mb-3 leading-snug group-hover:text-cyan-100 transition-colors line-clamp-2">
                  {post.title}
                </h2>

                {post.excerpt && (
                  <p className="text-sm text-slate-400 line-clamp-2 mb-5 leading-relaxed">
                    {post.excerpt}
                  </p>
                )}

                {/* Tech badges */}
                <div className="flex items-center gap-3 flex-wrap mb-5">
                  {post.has_code && (
                    <span className="flex items-center gap-1 text-xs text-slate-500">
                      <Code2 className="w-3 h-3" /> Code
                    </span>
                  )}
                  {post.has_latex && (
                    <span className="flex items-center gap-1 text-xs text-slate-500">
                      <Sigma className="w-3 h-3" /> LaTeX
                    </span>
                  )}
                  {post.read_time_min && (
                    <span className="flex items-center gap-1 text-xs text-slate-500">
                      <Clock className="w-3 h-3" /> {post.read_time_min} min
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-cyan-500 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  Read Deep Dive <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
