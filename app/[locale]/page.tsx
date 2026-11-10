import { Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import { selectHomepageArticles } from '@/lib/homepage';
import { FEATURED_SERIES } from '@/lib/featuredSeries';
import FadeIn from '@/components/FadeIn';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

export const dynamic = 'force-dynamic';

// Helper to format dates for deep dive metadata (locale-aware)
function formatDate(dateStr: string | null, locale: string) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString(locale === 'ko' ? 'ko-KR' : 'en-US', {
    timeZone: 'America/Los_Angeles',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
}

// Data Fetcher: Loads Research dynamically from tech_posts
async function LabPostsFetcher({ locale }: { locale: string }) {
  const t = await getTranslations('Home');
  const tLab = await getTranslations('Lab');
  if (!supabase) return <div className="text-[#8A938E] py-12 text-center">{t('loading')}</div>;

  // Only the fields the homepage renders — never body_mdx. Ordering matches
  // the selection contract in lib/homepage.ts (published_at desc, slug asc).
  const { data: posts, error } = await supabase
    .from('tech_posts')
    .select('slug, title, excerpt, cover_image_url, published_at, read_time_min, tags, locale, is_published')
    .eq('is_published', true)
    .eq('locale', locale)
    .order('published_at', { ascending: false })
    .order('slug', { ascending: true });

  if (error) {
    console.error('Supabase fetch error:', error);
  }

  // Featured = most recently published article in this locale.
  // Latest = the remaining published articles, newest first (max 6).
  const { featured, latest } = selectHomepageArticles(posts ?? [], locale);

  if (!featured) {
    return <div className="text-[#8A938E] py-12 text-center">{t('empty_state')}</div>;
  }

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
            {formatDate(featured.published_at, locale)}{featured.read_time_min ? ` · ${tLab('min_read', { minutes: featured.read_time_min })}` : ''}
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
      {latest.length > 0 && (
        <>
          <div className="mb-8 flex items-center gap-4">
            <h2 className="text-xl font-[family-name:var(--font-geist-sans)] font-bold tracking-tight text-[#1C2321]">{t('recent_deep_dives')}</h2>
            <div className="h-[1px] flex-1 bg-[#E4E7E2]" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
            {latest.map((post) => (
              <Link key={post.slug} href={`/${locale}/lab/${post.slug}`} className="group relative rounded-xl border border-[#E4E7E2] bg-[#FFFFFF] p-6 flex flex-col h-full transition-colors hover:border-[#4C6B59]/60">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-[10px] text-[#8A938E] font-mono tracking-widest uppercase">{formatDate(post.published_at, locale)}</span>
                  </div>
                  <h4 className="text-xl font-[family-name:var(--font-geist-sans)] font-bold text-[#1C2321] mb-3 transition-colors leading-tight">{post.title}</h4>
                  <p className="text-sm text-[#66716C] leading-relaxed mb-6 line-clamp-3">{post.excerpt}</p>
                </div>

                <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-[#E4E7E2]">
                  {post.tags?.slice(0, 2).map((tag: string) => (
                    <span key={tag} className="text-[10px] text-[#8A938E] font-mono uppercase tracking-wider">{tag}</span>
                  ))}
                  {(post.tags?.length ?? 0) > 2 && <span className="text-[10px] text-[#66716C]">+{(post.tags?.length ?? 0) - 2}</span>}
                </div>
              </Link>
            ))}

          </div>
        </>
      )}
    </div>
  );
}

// Ensure SEO Canonical compatibility matching Next.js App Router rules
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
    alternates: {
      canonical: `https://www.smartworklab.store/${locale}`,
      languages: {
        'en': `https://www.smartworklab.store/en`,
        'ko': `https://www.smartworklab.store/ko`,
      }
    },
    openGraph: {
      url: `https://www.smartworklab.store/${locale}`,
      type: 'website',
      locale: locale === 'ko' ? 'ko_KR' : 'en_US',
      siteName: 'SmartWorkLab',
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

        {/* Featured series: Mochi Sprout (curated config in lib/featuredSeries.ts) */}
        <section className="mb-16 rounded-xl border border-[#E4E7E2] bg-[#FFFFFF] p-6 md:p-8 text-[#1C2321]">
          <p className="text-xs font-mono uppercase tracking-widest text-[#4C6B59] mb-3">{t('featured_series')}</p>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight mb-3">{FEATURED_SERIES.title}</h2>
          <p className="text-base leading-relaxed mb-5 max-w-3xl text-[#66716C]">
            {locale === 'ko' ? FEATURED_SERIES.description.ko : FEATURED_SERIES.description.en}
          </p>
          <div className="flex flex-wrap gap-6 text-sm font-bold">
            {FEATURED_SERIES.days.map((day) => (
              <Link key={day.slug} href={`/${locale}/lab/${day.slug}`} className="text-[#4C6B59] hover:underline underline-offset-4">
                {locale === 'ko' ? day.labelKo : day.labelEn} →
              </Link>
            ))}
            <Link href={`/${locale}/lab/series`} className="text-[#4C6B59] hover:underline underline-offset-4">
              {t('view_series')} →
            </Link>
            <Link href={FEATURED_SERIES.githubUrl} target="_blank" rel="noopener noreferrer" className="text-[#66716C] hover:text-[#4C6B59] transition-colors">
              {FEATURED_SERIES.githubLabel} →
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
