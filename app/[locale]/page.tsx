import {useTranslations} from 'next-intl';
import PriceTracker from '@/components/PriceTracker';
import TopTenPicks from '@/components/TopTenPicks';

export default function HomePage() {
  const t = useTranslations('Index');
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
        <TopTenPicks />
      </section>
    </main>
  );
}
