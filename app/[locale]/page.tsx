import {useTranslations} from 'next-intl';
import { supabase } from '@/lib/supabase';
import PriceTracker from '@/components/PriceTracker';
import TopTenPicks from '@/components/TopTenPicks';

// Data Fetching
async function getTopTools() {
  if (!supabase) return [];

  // Fetch tools with their latest review metadata
  const { data: tools } = await supabase
    .from('tools')
    .select(`
      id, name, category,
      reviews!inner ( rating, transparency_source_count, summary )
    `)
    .eq('reviews.locale', 'en') // Default to EN for listing or pass locale
    .limit(10);

  // Transform to TopTenPicks shape
  return tools?.map(t => ({
    id: t.id,
    name: t.name,
    category: t.category,
    rating: t.reviews[0]?.rating || 0,
    transparency: t.reviews[0]?.transparency_source_count || 0,
    summary: t.reviews[0]?.summary || ''
  })) || [];
}

export default async function HomePage({params}: {params: Promise<{locale: string}>}) {
  const t = useTranslations('Index');
  const { locale } = await params;

  // We can pass locale to fetcher if needed
  const tools = await getTopTools();

  // Note: Client components (PriceTracker, TopTenPicks) might need props update
  // to accept data instead of internal mock.

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
        <PriceTracker />
      </section>

      <section>
         <TopTenPicks initialTools={tools} />
      </section>
    </main>
  );
}
