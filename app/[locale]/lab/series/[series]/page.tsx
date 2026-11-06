import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { seriesSlug } from '../page';

interface Props {
  params: Promise<{ locale: string; series: string }>;
}

interface TechPost {
  slug: string;
  title: string;
  excerpt: string | null;
  series: string | null;
  read_time_min: number | null;
  published_at: string | null;
}

function matchesSeries(name: string | null, param: string): boolean {
  if (!name) return false;
  return seriesSlug(name) === param;
}

export async function generateMetadata({ params }: Props) {
  const { locale, series } = await params;
  return {
    title: `Series: ${series} | SmartWorkLab`,
    alternates: {
      canonical: `https://smartworklab.store/${locale}/lab/series/${series}`,
      languages: {
        en: `https://smartworklab.store/en/lab/series/${series}`,
        ko: `https://smartworklab.store/ko/lab/series/${series}`,
      },
    },
  };
}

export default async function SeriesDetailPage({ params }: Props) {
  const { locale, series } = await params;

  let posts: TechPost[] = [];
  if (supabase) {
    const { data } = await supabase
      .from('tech_posts')
      .select('slug, title, excerpt, series, read_time_min, published_at')
      .eq('is_published', true)
      .eq('locale', locale)
      .order('published_at', { ascending: false });
    posts = (data ?? []).filter((p) => matchesSeries(p.series, series));
  }

  const isMochiSprout = series === 'mochi-sprout';
  if (posts.length === 0 && !isMochiSprout) notFound();

  const displayName =
    posts[0]?.series ?? (isMochiSprout ? 'Mochi Sprout' : series);

  return (
    <div className="bg-[#F7F7F4] text-[#1C2321] min-h-screen">
      <header className="pt-16 md:pt-20 pb-10 max-w-4xl mx-auto px-6">
        <p className="text-xs font-mono uppercase tracking-widest text-[#4C6B59] mb-3">Series</p>
        <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">{displayName}</h1>
        {isMochiSprout && (
          <p className="text-lg text-[#66716C] leading-relaxed max-w-2xl">
            {locale === 'ko'
              ? 'MuJoCo 시뮬레이션부터 하드웨어까지, 작은 반려 로봇을 공개적으로 만들어가는 과정. 측정 결과만 기록합니다.'
              : 'Building a small companion robot in public, from MuJoCo simulation to hardware. Measured results only.'}
          </p>
        )}
      </header>

      <main className="max-w-4xl mx-auto px-6 pb-24 space-y-4">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/${locale}/lab/${post.slug}`}
            className="group block rounded-xl border border-[#E4E7E2] bg-[#FFFFFF] p-6 hover:border-[#4C6B59]/60 transition-colors"
          >
            <p className="text-xs text-[#8A938E] font-mono mb-2">
              {post.published_at &&
                new Date(post.published_at).toLocaleDateString(locale, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              {post.read_time_min ? ` · ${post.read_time_min} min read` : ''}
            </p>
            <h2 className="text-xl font-bold tracking-tight mb-2">{post.title}</h2>
            {post.excerpt && (
              <p className="text-base text-[#66716C] leading-relaxed">{post.excerpt}</p>
            )}
          </Link>
        ))}

        {posts.length === 0 && isMochiSprout && (
          <div className="rounded-xl border border-[#E4E7E2] bg-[#FFFFFF] p-6 md:p-8">
            <p className="text-base text-[#66716C] leading-relaxed mb-4">
              {locale === 'ko'
                ? 'Day 1 진자 실험은 완료됐고, 첫 아티클은 발행 준비 중입니다. 실험 기록과 코드는 GitHub에서 먼저 볼 수 있습니다.'
                : 'The Day 1 pendulum experiment is done; the first article is in preparation. Experiment notes and code are on GitHub in the meantime.'}
            </p>
            <a
              href="https://github.com/yunsupj/mochi-sprout"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-bold text-[#4C6B59] hover:underline underline-offset-4"
            >
              github.com/yunsupj/mochi-sprout →
            </a>
          </div>
        )}
      </main>
    </div>
  );
}
