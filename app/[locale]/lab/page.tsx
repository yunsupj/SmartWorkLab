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
  const t = await getTranslations('Lab');

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
    <div className="bg-[#F7F7F4] text-[#1C2321] min-h-screen">
      {/* Header */}
      <header className="pt-16 md:pt-20 pb-10 max-w-4xl mx-auto px-6">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight text-[#1C2321]">
          {t('title')}
        </h1>
        <p className="text-lg text-[#66716C] leading-relaxed max-w-2xl">
          {t('subtitle')}
        </p>
      </header>

      {/* Post Grid */}
      <main className="max-w-7xl mx-auto px-6 pb-24">
        {posts.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-[#E4E7E2] rounded-2xl">
            <FlaskConical className="w-12 h-12 text-[#66716C] mx-auto mb-4" />
            <p className="text-[#8A938E] font-mono text-sm">{locale === 'ko' ? '기술 아티클을 준비하고 있습니다.' : 'Technical articles are being prepared.'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/${locale}/lab/${post.slug}`}
                className="group block bg-white/70 backdrop-blur-md border border-[#E4E7E2] rounded-xl p-6 hover:border-[#4C6B59]/50 transition-all hover:-translate-y-1 relative overflow-hidden"
              >
                {/* Spotlight */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#DCE8DF]/30 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none group-hover:bg-[#DCE8DF]/40 transition-colors" />

                {/* Series badge */}
                {post.series && (
                  <span className="inline-block text-xs font-mono text-[#4C6B59] bg-[#DCE8DF]/70 border border-[#4C6B59]/30 rounded-full px-3 py-1 mb-4">
                    {post.series}
                  </span>
                )}

                <h2 className="text-lg font-bold text-[#1C2321] mb-3 leading-snug group-hover:text-[#4C6B59] transition-colors line-clamp-2">
                  {post.title}
                </h2>

                {post.excerpt && (
                  <p className="text-sm text-[#66716C] line-clamp-2 mb-5 leading-relaxed">
                    {post.excerpt}
                  </p>
                )}

                {/* Tech badges */}
                <div className="flex items-center gap-3 flex-wrap mb-5">
                  {post.has_code && (
                    <span className="flex items-center gap-1 text-xs text-[#8A938E]">
                      <Code2 className="w-3 h-3" /> Code
                    </span>
                  )}
                  {post.has_latex && (
                    <span className="flex items-center gap-1 text-xs text-[#8A938E]">
                      <Sigma className="w-3 h-3" /> LaTeX
                    </span>
                  )}
                  {post.read_time_min && (
                    <span className="flex items-center gap-1 text-xs text-[#8A938E]">
                      <Clock className="w-3 h-3" /> {post.read_time_min} min
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-[#4C6B59] text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  {t('read_more')} <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
