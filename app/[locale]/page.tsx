import { Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import FadeIn from '@/components/FadeIn';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

export const dynamic = 'force-dynamic';

// Helper to format dates for deep dive metadata
function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    timeZone: 'America/Los_Angeles',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

// Data Fetcher: Loads Research dynamically from tech_posts
async function LabPostsFetcher({ locale }: { locale: string }) {
  const t = await getTranslations('Home');
  if (!supabase) return <div className="text-[#8A938E] py-12 text-center">{t('loading')}</div>;

  // Fetch all published posts to calculate engagement rankings
  const { data: posts, error } = await supabase
    .from('tech_posts')
    .select('*')
    .eq('is_published', true)
    .eq('locale', locale);

  if (error) {
    console.error('Supabase fetch error:', error);
  }

  if (!posts || posts.length === 0) {
    return <div className="text-[#8A938E] py-12 text-center">{t('empty_state')}</div>;
  }

  // Calculate Engagement Scores: Score = (Views * 1) + (Likes * 5)
  const rankedPosts = [...posts].sort((a, b) => {
    const scoreA = (a.view_count || 0) + ((a.like_count || 0) * 5);
    const scoreB = (b.view_count || 0) + ((b.like_count || 0) * 5);
    return scoreB - scoreA;
  });

  const recentPosts = [...posts].sort((a, b) =>
    new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
  );

  // 1. Weekly Top Research (Highest score in last 7 days)
  // eslint-disable-next-line react-hooks/purity -- server component date math, not a hook
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  let featured = rankedPosts.find(p => new Date(p.published_at) >= sevenDaysAgo);
  if (!featured) featured = rankedPosts[0]; // Fallback if no posts in last 7 days

  // 2. 50/50 Mix for Recent Deep Dives
  const otherRanked = rankedPosts.filter(p => p.slug !== featured.slug);
  const otherRecent = recentPosts.filter(p => p.slug !== featured.slug);

  // Dynamically alternate between recent and ranked posts
  const combined = [];
  const maxLength = Math.max(otherRecent.length, otherRanked.length);
  for (let i = 0; i < maxLength; i++) {
    if (otherRecent[i]) combined.push(otherRecent[i]);
    if (otherRanked[i]) combined.push(otherRanked[i]);
  }

  // Deduplicate by object reference using Set
  const uniquePool = Array.from(new Set(combined)).filter(Boolean);

  // Safely slice up to 6 items
  const recent = uniquePool.slice(0, 6);



  return (
    <div className="w-full">
      {/* Featured Research Card */}
      <div className="mb-8 flex items-center gap-4">
        <h2 className="text-xl font-[family-name:var(--font-geist-sans)] font-bold tracking-tight text-[#1C2321]">{t('weekly_top')}</h2>
        <div className="h-[1px] flex-1 bg-[#E4E7E2]" />
      </div>

      <Link href={`/${locale}/lab/${featured.slug}`} className="group block mb-16">
        <article className="rounded-xl border border-[#E4E7E2] bg-[#FFFFFF] p-6 md:p-8 transition-colors hover:border-[#4C6B59]/60">
          {featured.cover_image_url && (
            <div className="mb-6 overflow-hidden rounded-lg">
              <img src={featured.cover_image_url} alt={featured.title} className="w-full object-cover" />
            </div>
          )}
          <p className="text-xs text-[#8A938E] font-mono mb-3">
            {formatDate(featured.published_at)}{featured.read_time_min ? ` · ${featured.read_time_min} MIN READ` : ''}
          </p>
          <h3 className="text-2xl md:text-3xl font-[family-name:var(--font-geist-sans)] font-bold text-[#1C2321] tracking-tight mb-3 leading-tight">{featured.title}</h3>
          <p className="text-base text-[#66716C] mb-5 max-w-2xl leading-relaxed">{featured.excerpt}</p>
          {featured.tags && featured.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {featured.tags.map((tag: string) => (
                <span key={tag} className="text-xs text-[#66716C] bg-[#F7F7F4] px-2.5 py-1 rounded-md border border-[#E4E7E2]">#{tag}</span>
              ))}
            </div>
          )}
          <span className="inline-flex items-center gap-2 text-[#4C6B59] text-sm font-bold">
            {t('read_article')} <span className="group-hover:translate-x-1 transition-transform">→</span>
          </span>
        </article>
      </Link>

      {/* Recent Deep Dives Grid */}
      <div className="mb-8 flex items-center gap-4">
        <h2 className="text-xl font-[family-name:var(--font-geist-sans)] font-bold tracking-tight text-[#1C2321]">{t('recent_deep_dives')}</h2>
        <div className="h-[1px] flex-1 bg-[#E4E7E2]" />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
        {recent.map((post) => (
          <Link key={post.slug} href={`/${locale}/lab/${post.slug}`} className="group relative rounded-xl border border-[#E4E7E2] bg-[#FFFFFF] p-6 flex flex-col h-full transition-colors hover:border-[#4C6B59]/60">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[10px] text-[#8A938E] font-mono tracking-widest uppercase">{formatDate(post.published_at)}</span>
              </div>
              <h4 className="text-xl font-[family-name:var(--font-geist-sans)] font-bold text-[#1C2321] mb-3 transition-colors leading-tight">{post.title}</h4>
              <p className="text-sm text-[#66716C] leading-relaxed mb-6 line-clamp-3">{post.excerpt}</p>
            </div>

            <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-[#E4E7E2]">
              {post.tags?.slice(0, 2).map((tag: string) => (
                <span key={tag} className="text-[10px] text-[#8A938E] font-mono uppercase tracking-wider">{tag}</span>
              ))}
              {(post.tags?.length || 0) > 2 && <span className="text-[10px] text-[#66716C]">+{post.tags.length - 2}</span>}
            </div>
          </Link>
        ))}


      </div>
    </div>
  );
}

// Ensure SEO Canonical compatibility matching Next.js App Router rules
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
    alternates: {
      canonical: `https://smartworklab.store/${locale}`,
      languages: {
        'en': `https://smartworklab.store/en`,
        'ko': `https://smartworklab.store/ko`,
      }
    }
  };
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('Home');

  return (
    <div className="bg-[#F7F7F4] text-[#1C2321] min-h-screen font-sans selection:bg-[#DCE8DF]/70">
      <div className="max-w-4xl mx-auto px-6 pt-16 md:pt-20 pb-16">

        {/* Editorial masthead */}
        <header className="mb-14 max-w-3xl border-b border-[#E4E7E2] pb-10">
          <p className="text-xs font-mono uppercase tracking-widest text-[#4C6B59] mb-4">{t('hero_badge')}</p>
          <h1 className="text-4xl md:text-5xl font-[family-name:var(--font-geist-sans)] font-bold mb-5 tracking-tight text-[#1C2321] leading-tight">
            {t('hero_title')}
          </h1>
          <p className="text-lg text-[#66716C] leading-relaxed max-w-2xl">
            {t('hero_subtitle')}
          </p>
          <div className="flex flex-wrap items-center gap-6 mt-7 text-sm font-bold">
            <Link href={`/${locale}/lab`} className="text-[#4C6B59] hover:underline underline-offset-4">
              {t('cta_lab')} →
            </Link>
            <Link href="https://github.com/yunsupj/mochi-sprout" target="_blank" rel="noopener noreferrer" className="text-[#66716C] hover:text-[#4C6B59] transition-colors">
              {t('cta_services')} →
            </Link>
          </div>
        </header>

        {/* Featured series: Mochi Sprout (static, no Supabase dependency) */}
        <section className="mb-16 rounded-xl border border-[#E4E7E2] bg-[#FFFFFF] p-6 md:p-8 text-[#1C2321]">
          <p className="text-xs font-mono uppercase tracking-widest text-[#4C6B59] mb-3">{t('featured_series')}</p>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight mb-3">Mochi Sprout — Phase 0 · Day 2</h2>
          <p className="text-base leading-relaxed mb-5 max-w-3xl text-[#66716C]">
            {locale === 'ko'
              ? 'Day 1: 두 중력에서의 진자 비교, 최대 각도 차이 0.909 rad 측정. Day 2: P·PI·PD·PID 스텝 응답 비교 — PID는 +30° 스텝 후 3.630초 만에 안정됐고 최종 구간 MAE 0.313°, P와 PI는 진동하며 안정되지 않았습니다. 아직 시뮬레이션만 있습니다. 걷기, 하드웨어, 강화학습은 없습니다. 다음은 게인과 지연에 대한 강건성입니다.'
              : 'Day 1: pendulum under two gravities, max angle difference 0.909 rad. Day 2: P, PI, PD, and PID step responses — PID settled 3.630 s after a +30° step with final-window MAE 0.313°, while P and PI oscillated and never settled. Still simulation only: no walking, no hardware, no reinforcement learning. Next: robustness across gains and delays.'}
          </p>
          <div className="flex flex-wrap gap-6 text-sm font-bold">
            <Link href={`/${locale}/lab/series`} className="text-[#4C6B59] hover:underline underline-offset-4">
              {t('view_series')} →
            </Link>
            <Link href="https://github.com/yunsupj/mochi-sprout" target="_blank" rel="noopener noreferrer" className="text-[#66716C] hover:text-[#4C6B59] transition-colors">
              github.com/yunsupj/mochi-sprout →
            </Link>
          </div>
        </section>

        {/* DYNAMIC POST FETCHING GRID */}
        <FadeIn delay={0.4}>
          <Suspense fallback={<div className="h-96 w-full rounded-2xl bg-white/70 animate-pulse border border-[#E4E7E2] flex items-center justify-center text-[#66716C] font-mono">{locale === 'ko' ? '아티클을 불러오는 중...' : 'Loading articles...'}</div>}>
            <LabPostsFetcher locale={locale} />
          </Suspense>
        </FadeIn>


      </div>
    </div>
  );
}
