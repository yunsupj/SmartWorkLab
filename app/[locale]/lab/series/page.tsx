import { supabase } from '@/lib/supabase';
import { seriesSlug, isMochiSproutSeries } from '@/lib/series';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'ko' ? '연재 시리즈 | SmartWorkLab' : 'Series | SmartWorkLab',
    description:
      locale === 'ko'
        ? '하나의 주제를 처음부터 차근차근 따라갈 수 있도록 글을 모았습니다.'
        : 'Articles grouped into ongoing research series.',
    alternates: {
      canonical: `https://www.smartworklab.store/${locale}/lab/series`,
      languages: {
        en: 'https://www.smartworklab.store/en/lab/series',
        ko: 'https://www.smartworklab.store/ko/lab/series',
      },
    },
  };
}

interface SeriesGroup {
  name: string;
  count: number;
  latest: string | null;
}

export default async function SeriesIndexPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations('Lab');

  const groups = new Map<string, SeriesGroup>();
  if (supabase) {
    const { data } = await supabase
      .from('tech_posts')
      .select('series, published_at')
      .eq('is_published', true)
      .eq('locale', locale)
      .order('published_at', { ascending: false });
    for (const row of data ?? []) {
      const name = row.series || 'Uncategorized';
      const g = groups.get(name) ?? { name, count: 0, latest: null };
      g.count += 1;
      if (!g.latest) g.latest = row.published_at;
      groups.set(name, g);
    }
  }

  const hasMochiSprout = [...groups.keys()].some((n) => isMochiSproutSeries(n));

  return (
    <div className="bg-[#F7F7F4] text-[#1C2321] min-h-screen">
      <header className="pt-16 md:pt-20 pb-10 max-w-4xl mx-auto px-6">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">{t('series_title')}</h1>
        <p className="text-lg text-[#66716C] leading-relaxed max-w-2xl">
          {t('series_subtitle')}
        </p>
      </header>

      <main className="max-w-4xl mx-auto px-6 pb-24 space-y-4">
        {/* Featured series: Mochi Sprout — shown even before its first article is published. */}
        <article className="rounded-xl border border-[#E4E7E2] bg-[#FFFFFF] p-6 md:p-8">
          <p className="text-xs font-mono uppercase tracking-widest text-[#4C6B59] mb-3">
            {locale === 'ko' ? '진행 중 시리즈' : 'Ongoing series'}
          </p>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight mb-2">
            Mochi Sprout — {locale === 'ko' ? '오픈소스 피지컬 AI 로봇' : 'Open-Source Physical AI Robot'}
          </h2>
          <p className="text-base text-[#66716C] leading-relaxed mb-4 max-w-2xl">
            {locale === 'ko'
              ? 'MuJoCo 시뮬레이션부터 하드웨어까지, 작은 반려 로봇을 공개적으로 만들어가는 과정. Day 1 진자 실험과 Day 2 PID 스텝 응답 비교 완료: PID는 +30° 스텝 후 3.630초 만에 안정, 최종 구간 MAE 0.313°.'
              : 'Building a small companion robot in public, from MuJoCo simulation to hardware. Day 1 pendulum experiment and Day 2 PID step-response comparison done: PID settled 3.630 s after a +30° step, final-window MAE 0.313°.'}
          </p>
          <div className="flex flex-wrap gap-6 text-sm font-bold">
            {hasMochiSprout ? (
              <Link href={`/${locale}/lab/series/mochi-sprout`} className="text-[#4C6B59] hover:underline underline-offset-4">
                {locale === 'ko' ? '시리즈 글 보기' : 'View series articles'} →
              </Link>
            ) : (
              <span className="text-[#8A938E]">
                {locale === 'ko' ? '첫 아티클 준비 중' : 'First article in preparation'}
              </span>
            )}
            <a href="https://github.com/yunsupj/mochi-sprout" target="_blank" rel="noopener noreferrer" className="text-[#66716C] hover:text-[#4C6B59] transition-colors">
              github.com/yunsupj/mochi-sprout →
            </a>
          </div>
        </article>

        {[...groups.values()]
          .filter((g) => !isMochiSproutSeries(g.name))
          .map((g) => (
            <Link
              key={g.name}
              href={`/${locale}/lab/series/${seriesSlug(g.name)}`}
              className="group block rounded-xl border border-[#E4E7E2] bg-[#FFFFFF] p-6 hover:border-[#4C6B59]/60 transition-colors"
            >
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="text-lg font-bold tracking-tight">{g.name}</h2>
                <span className="text-sm text-[#8A938E] font-mono whitespace-nowrap">
                  {locale === 'ko' ? `${g.count}편` : `${g.count} ${g.count === 1 ? 'article' : 'articles'}`}
                </span>
              </div>
              {g.latest && (
                <p className="text-sm text-[#66716C] mt-1">
                  {new Date(g.latest).toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              )}
            </Link>
          ))}

        {groups.size === 0 && !hasMochiSprout && (
          <p className="text-[#8A938E] py-8 text-center">
            {locale === 'ko' ? '아직 발행된 시리즈가 없습니다.' : 'No published series yet.'}
          </p>
        )}
      </main>
    </div>
  );
}
