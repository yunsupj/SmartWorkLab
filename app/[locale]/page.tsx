import { Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import FadeIn from '@/components/FadeIn';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Code2, Cpu, Database, Zap, Flame } from 'lucide-react';

export const revalidate = 60;

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
  if (!supabase) return <div className="text-slate-500 py-12 text-center">Research lab initializing...</div>;

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
    return <div className="text-slate-500 py-12 text-center">Research DB currently offline.</div>;
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
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  let featured = rankedPosts.find(p => new Date(p.published_at) >= sevenDaysAgo);
  if (!featured) featured = rankedPosts[0]; // Fallback if no posts in last 7 days

  // 2. 50/50 Mix for Recent Deep Dives
  const otherRanked = rankedPosts.filter(p => p.slug !== featured.slug);
  const otherRecent = recentPosts.filter(p => p.slug !== featured.slug);

  // Deduplicate and mix (e.g. up to 3 posts: 1 from recent, 1 from top, 1 from recent)
  const mixedPool = Array.from(new Set([
    otherRecent[0],
    otherRanked[0],
    otherRecent[1],
    otherRanked[1],
    otherRecent[2]
  ])).filter(Boolean);

  const recent = mixedPool.slice(0, 6);

  // Track Top 3 slugs for the Trending badge
  const top3Slugs = new Set(rankedPosts.slice(0, 3).map(p => p.slug));

  const UPCOMING_RESEARCH = [
    {
      title: "VTON Chain Orchestration",
      excerpt: "Solving multi-item clothing synthesis through asynchronous Edge Function pipelines.",
      status: "In Review",
      icon: <Cpu size={16} className="text-cyan-400" />
    },
    {
      title: "Style DNA Vector Space",
      excerpt: "Mapping user aesthetics into 32-dimensional latent space for sub-50ms recommendation.",
      status: "Simulated",
      icon: <Zap size={16} className="text-purple-400" />
    },
    {
      title: "Redis Write-Buffer Patterns",
      excerpt: "Protecting PostgreSQL from viral row-level locking during traffic surges.",
      status: "Draft",
      icon: <Database size={16} className="text-emerald-400" />
    }
  ];

  return (
    <div className="w-full">
      {/* Featured Research Card */}
      <div className="mb-8 flex items-center gap-4">
        <h2 className="text-2xl font-[family-name:var(--font-geist-sans)] font-bold tracking-tight text-white">{t('weekly_top')}</h2>
        <div className="h-[1px] flex-1 bg-slate-800/60" />
      </div>

      <Link href={`/${locale}/lab/${featured.slug}`} className="group block mb-16">
        <div className="relative rounded-2xl border border-slate-800 bg-slate-900/40 p-1 transition-all duration-300 hover:border-cyan-500/30 hover:bg-slate-900/60 hover:shadow-[0_0_30px_rgba(6,182,212,0.1)] lg:grid lg:grid-cols-2 gap-0 overflow-hidden">

          <div className="lg:order-last p-1">
            {featured.cover_image_url ? (
              <div className="aspect-[2/1] lg:aspect-auto lg:h-full lg:min-h-[320px] w-full overflow-hidden rounded-xl bg-slate-950 mb-0">
                <img src={featured.cover_image_url} alt={featured.title} className="h-full w-full object-cover opacity-80 transition-transform duration-500 group-hover:scale-105" />
              </div>
            ) : (
              <div className="aspect-[2/1] lg:aspect-auto lg:h-full lg:min-h-[320px] w-full rounded-xl bg-gradient-to-br from-slate-900 to-slate-950 border-b border-slate-800/50 flex items-center justify-center overflow-hidden relative mb-0">
                 <div className="absolute inset-0 bg-[linear-gradient(to_right,#47556915_1px,transparent_1px),linear-gradient(to_bottom,#47556915_1px,transparent_1px)] bg-[size:24px_24px]" />
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-cyan-500/20 blur-3xl rounded-full animate-pulse" />
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-purple-500/20 blur-3xl rounded-full animate-pulse delay-500" />
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
                 <Code2 size={64} className="text-slate-700 relative z-10 opacity-80 shadow-sm" />
              </div>
            )}
          </div>

          <div className="p-6 md:p-8 flex flex-col justify-center">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {top3Slugs.has(featured.slug) && (
                <span className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-widest text-amber-500 bg-amber-500/10 rounded-full border border-amber-500/20 flex items-center gap-1.5 shadow-[0_0_10px_rgba(245,158,11,0.2)]">
                  <Flame className="w-3 h-3 text-amber-500 fill-amber-500/50" />
                  Trending
                </span>
              )}
              <span className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-400 bg-cyan-500/10 rounded-full border border-cyan-500/20">
                Latest Deep Dive
              </span>
              <span className="text-xs text-slate-500 font-mono flex items-center gap-1.5">
                {formatDate(featured.published_at)} <span className="w-1 h-1 rounded-full bg-slate-700 block"/> {featured.read_time_min} MIN READ
              </span>
            </div>

            <h3 className="text-3xl md:text-5xl font-[family-name:var(--font-geist-sans)] font-bold text-slate-100 tracking-tight mb-4 group-hover:text-cyan-50">{featured.title}</h3>
            <p className="text-lg text-slate-400 mb-6 max-w-xl leading-relaxed">{featured.excerpt}</p>

            <div className="flex flex-wrap gap-2 mb-8">
              {featured.tags?.map((tag: string) => (
                <span key={tag} className="text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded-md border border-slate-800/80 shadow-md">#{tag}</span>
              ))}
            </div>

            <div className="inline-flex items-center gap-2 text-cyan-400 font-mono text-sm tracking-widest uppercase font-bold border-b border-cyan-500/30 group-hover:border-cyan-400 pb-1 w-max transition-colors">
              Read Full Research <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </div>
        </div>
      </Link>

      {/* Recent Deep Dives Grid */}
      <div className="mb-8 flex items-center gap-4">
        <h2 className="text-2xl font-[family-name:var(--font-geist-sans)] font-bold tracking-tight text-white">{t('recent_deep_dives')}</h2>
        <div className="h-[1px] flex-1 bg-slate-800/60" />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
        {recent.map((post) => (
          <Link key={post.slug} href={`/${locale}/lab/${post.slug}`} className="group relative rounded-2xl border border-slate-800 bg-slate-900/30 p-6 flex flex-col h-full transition-all duration-300 hover:border-slate-600 hover:bg-slate-900/60 hover:shadow-[0_0_20px_rgba(255,255,255,0.02)]">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-4">
                {top3Slugs.has(post.slug) && (
                  <span className="text-[10px] text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded flex items-center gap-1">
                    <Flame className="w-2.5 h-2.5 fill-amber-500/50" /> Trending
                  </span>
                )}
                <span className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">{formatDate(post.published_at)}</span>
              </div>
              <h4 className="text-xl font-[family-name:var(--font-geist-sans)] font-bold text-slate-200 mb-3 group-hover:text-white transition-colors leading-tight">{post.title}</h4>
              <p className="text-sm text-slate-400 leading-relaxed mb-6 line-clamp-3">{post.excerpt}</p>
            </div>

            <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-slate-800/50">
              {post.tags?.slice(0, 2).map((tag: string) => (
                <span key={tag} className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">{tag}</span>
              ))}
              {(post.tags?.length || 0) > 2 && <span className="text-[10px] text-slate-600">+{post.tags.length - 2}</span>}
            </div>
          </Link>
        ))}

        {UPCOMING_RESEARCH.slice(0, Math.max(0, 3 - recent.length)).map((item, i) => (
          <div key={`upcoming-${i}`} className="relative rounded-2xl border border-slate-800/50 bg-slate-900/10 p-6 flex flex-col h-full transition-all duration-300 hover:bg-slate-900/30 hover:shadow-[0_0_20px_rgba(6,182,212,0.02)] group overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#47556910_1px,transparent_1px),linear-gradient(to_bottom,#47556910_1px,transparent_1px)] bg-[size:16px_16px] opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className="relative z-10 flex-1">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 border border-slate-700/50 bg-slate-800/50 rounded-lg shadow-inner">
                  {item.icon}
                </div>
                <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase flex items-center gap-1.5 border border-slate-700/50 px-2.5 py-1 rounded-full bg-slate-800/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-pulse" />
                  {item.status}
                </span>
              </div>
              <h4 className="text-xl font-[family-name:var(--font-geist-sans)] font-bold text-slate-400 mb-3 group-hover:text-slate-300 transition-colors leading-tight drop-shadow-sm">{item.title}</h4>
              <p className="text-sm text-slate-500 leading-relaxed mb-6 line-clamp-3">{item.excerpt}</p>
            </div>
            <div className="relative z-10 mt-auto pt-4 border-t border-slate-800/30 flex items-center text-[10px] text-slate-600 font-mono uppercase tracking-widest">
               Access Pending <span className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">...</span>
            </div>
          </div>
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
        'de': `https://smartworklab.store/de`,
      }
    }
  };
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('Home');

  return (
    <div className="bg-[#020617] text-white min-h-screen font-sans selection:bg-cyan-500/30">

      {/* Background glow establishing deep tech vibe */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-1/4 w-[500px] h-[500px] bg-cyan-900/10 rounded-full blur-[120px] mix-blend-screen animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-1/4 w-[600px] h-[600px] bg-slate-800/20 rounded-full blur-[120px] mix-blend-screen"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-16">

        {/* NEW HERO */}
        <header className="mb-24 max-w-4xl">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-8 rounded-full bg-slate-900/80 border border-slate-800 text-xs font-mono font-medium text-slate-400">
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-[pulse_2s_infinite] shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
              {t('hero_badge')}
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h1 className="text-5xl md:text-7xl font-[family-name:var(--font-geist-sans)] font-bold mb-8 tracking-tight text-white drop-shadow-sm leading-tight">
              {t('hero_title')}
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="text-xl text-slate-400 mb-10 leading-relaxed max-w-2xl font-light">
              {t('hero_subtitle')}
            </p>
          </FadeIn>

          {/* DUAL CTAS */}
          <FadeIn delay={0.3} className="flex flex-wrap items-center gap-4">
            <Link href={`/${locale}/lab`} className="px-6 py-3 bg-white text-slate-950 font-bold rounded-full hover:bg-slate-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)]">
              {t('cta_lab')}
            </Link>
            <Link href={`/${locale}/services`} className="px-6 py-3 bg-slate-900 text-white font-bold rounded-full border border-slate-800 hover:bg-slate-800 hover:border-slate-700 transition-colors">
              {t('cta_services')}
            </Link>
          </FadeIn>
        </header>

        {/* DYNAMIC POST FETCHING GRID */}
        <FadeIn delay={0.4}>
          <Suspense fallback={<div className="h-96 w-full rounded-2xl bg-slate-900/50 animate-pulse border border-slate-800 flex items-center justify-center text-slate-600 font-mono">Loading Database...</div>}>
            <LabPostsFetcher locale={locale} />
          </Suspense>
        </FadeIn>

        {/* THE SUBTLE B2B FOOTER */}
        <FadeIn delay={0.5} className="mt-12 py-16 border-t border-slate-800/60 text-center flex flex-col items-center">
            <h3 className="text-3xl font-[family-name:var(--font-geist-sans)] font-bold text-white mb-4 tracking-tight">{t('footer_title')}</h3>
            <p className="text-slate-400 mb-8 max-w-md leading-relaxed">{t('footer_p')}</p>
            <Link href={`/${locale}/services`} className="text-cyan-400 flex items-center gap-2 group font-mono tracking-widest uppercase text-sm font-bold border-b border-cyan-500/30 hover:border-cyan-400 pb-1 transition-colors">
              {t('footer_cta')} <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
        </FadeIn>

      </div>
    </div>
  );
}
