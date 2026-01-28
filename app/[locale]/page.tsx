import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import PriceTracker from '@/components/PriceTracker';
import TopTenPicks from '@/components/TopTenPicks';

// Data Fetching Component
async function TopToolsFetcher() {
  if (!supabase) return <div className="text-red-400 text-center">Database connection client missing.</div>;

  const { data: tools, error } = await supabase
    .from('tools')
    .select(`
      id, name, category,
      reviews!inner ( rating, transparency_source_count, summary )
    `)
    .eq('reviews.locale', 'en')
    .limit(10);

  if (error) {
    console.error("Supabase Error:", error);
    return <div className="text-red-400 text-center">Failed to load tools. Please try again later.</div>;
  }

  const formattedTools = tools?.map(t => ({
    id: t.id,
    name: t.name,
    category: t.category,
    rating: t.reviews[0]?.rating || 0,
    transparency: t.reviews[0]?.transparency_source_count || 0,
    summary: t.reviews[0]?.summary || ''
  })) || [];

  return <TopTenPicks initialTools={formattedTools} />;
}

export default async function HomePage({params}: {params: Promise<{locale: string}>}) {
  const { locale } = await params;
  const t = await getTranslations({locale, namespace: 'Index'});

  return (
    <main className="min-h-screen p-8 max-w-7xl mx-auto">
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-bold bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent mb-4">
          {t('title')}
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          {t('description')}
        </p>
      </header>

      <section className="mb-16">
        <h2 className="text-sm font-mono text-cyan-400 mb-4 uppercase tracking-wider">Live Market Data</h2>
        {/* PriceTracker is a client component, wrapped in Suspense if it fetches, checking... it's a mock inside */}
        <PriceTracker />
      </section>

      <section>
         <Suspense fallback={<div className="text-slate-500 animate-pulse text-center p-12">Loading Top Honest Picks...</div>}>
           <TopToolsFetcher />
         </Suspense>
      </section>
    </main>
  );
}
