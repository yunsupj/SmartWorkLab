
import { Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import PriceTracker from '@/components/PriceTracker';
import TopTenPicks from '@/components/TopTenPicks';
import SavingsCalculator from '@/components/SavingsCalculator';
import PromoTicker from '@/components/PromoTicker';
import TransparencyMeter from '@/components/TransparencyMeter';
import AdPlaceholder from '@/components/AdPlaceholder';
import FadeIn from '@/components/FadeIn';
// Data Fetcher
import { getTranslations } from 'next-intl/server';

export const runtime = 'edge';

async function TopToolsFetcher() {
  if (!supabase) return <div className="text-red-400 text-center">Database connection client missing.</div>;

  const { data: tools, error } = await supabase
    .from('products')
    .select(`
      id, name, category,
      reviews ( rating, transparency_source_count, summary )
    `)
    .limit(10);

  if (error) {
    console.error("Supabase Error:", error);
    return <div className="text-red-400 text-center">Failed to load tools. Please try again later.</div>;
  }

  const formattedTools = tools?.map(t => ({
    id: t.id,
    name: t.name,
    category: t.category,
    rating: t.reviews?.[0]?.rating || 0,
    transparency: t.reviews?.[0]?.transparency_source_count || 0,
    summary: t.reviews?.[0]?.summary || ''
  })) || [];

  return <TopTenPicks initialTools={formattedTools} />;
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('Index');

  return (
    <div className="bg-slate-950 text-white min-h-screen font-sans selection:bg-cyan-500/30">
        {/* Dynamic Background */}
        <div className="fixed inset-0 z-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl mix-blend-screen animate-pulse"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl mix-blend-screen animate-pulse delay-700"></div>
        </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">

        {/* Hero Section */}
        <header className="pt-24 pb-8 md:pt-32 md:pb-12 text-center">
          <FadeIn>
            <div className="inline-block px-4 py-1.5 mb-6 text-xs font-mono font-medium text-cyan-400 border border-cyan-500/30 rounded-full bg-cyan-950/30 backdrop-blur-sm uppercase tracking-widest shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                SmartWorkLab Intelligence
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400 drop-shadow-sm">
                {t('title')}
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
                {t('description')}
            </p>
          </FadeIn>

          {/* Live Market Data (Hero Placement) */}
          <FadeIn delay={0.3} className="text-left max-w-5xl mx-auto mb-6">
             <div className="backdrop-blur-sm bg-slate-950/30 rounded-xl p-2 border border-slate-800/50">
                <PriceTracker />
             </div>
          </FadeIn>

          {/* Global Trust Section (Transparency Meter) */}
          <FadeIn delay={0.4} className="max-w-md mx-auto mb-8">
             <div className="flex items-center justify-center gap-4 bg-slate-900/50 p-4 rounded-full border border-slate-800/50 backdrop-blur-sm">
                 <span className="text-xs text-slate-400 uppercase tracking-widest">Trust Score</span>
                 <div className="h-2 w-32 bg-slate-800 rounded-full overflow-hidden">
                     <div className="h-full bg-green-500 w-[98%] shadow-[0_0_10px_#22c55e]"></div>
                 </div>
                 <span className="text-green-400 font-bold text-sm">98/100</span>
             </div>
          </FadeIn>
        </header>

        {/* Profit Suite Component */}
        <FadeIn delay={0.5} className="mb-24">
            <PromoTicker />
        </FadeIn>

        {/* Calculator (Restored Position) */}
        <FadeIn delay={0.6} className="mb-12">
            <SavingsCalculator />
        </FadeIn>

        {/* AdSense Mid-Page */}
        <FadeIn delay={0.65} className="mb-24 flex justify-center">
             <AdPlaceholder slotId="home-mid-1" label="Sponsored" format="rectangle" />
        </FadeIn>

        {/* Main Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-24">
            <FadeIn delay={0.7} className="md:col-span-3">
                 <Suspense fallback={<div className="text-slate-500 animate-pulse text-center p-12">Loading Insights...</div>}>
                   <TopToolsFetcher />
                 </Suspense>
            </FadeIn>
        </div>

      </div>
    </div>
  );
}
