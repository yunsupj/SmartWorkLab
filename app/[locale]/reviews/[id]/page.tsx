import { notFound } from 'next/navigation';
import Link from 'next/link';
import TransparencyMeter from '@/components/TransparencyMeter';
import { supabase } from '@/lib/supabase';

// Real Data Fetcher
async function getTool(id: string, locale: string) {
  if (!supabase) return null;

  // Get Tool
  const { data: tool } = await supabase
    .from('tools')
    .select('*')
    .eq('id', id)
    .single();

  if (!tool) return null;

  // Get Review for locale
  const { data: review } = await supabase
    .from('reviews')
    .select('*')
    .eq('tool_id', id)
    .eq('locale', locale)
    .single();

  // Get Metrics
  const { data: metrics } = await supabase
    .from('metrics')
    .select('*')
    .eq('tool_id', id)
    .order('timestamp', { ascending: false })
    .limit(1)
    .single();

  // Merge Data
  return {
    id: tool.id,
    name: tool.name,
    category: tool.category,
    price: tool.price_model === 'Free' ? 'Free' : tool.price_model === 'Freemium' ? 'Freemium' : '$' + (metrics?.price_current || 0),
    rating: review?.rating || 0,
    reviewCount: 1, // Mock count
    transparency: review?.transparency_source_count || 0,
    author: review?.author || 'SmartWorkLab AI',
    summary: review?.summary || tool.description,
    title: review?.title || tool.name + ' Review',
    smartScore: review?.smart_score || { roi: 0, privacy: 0, integration: 0, total: 0 },
    competitors: review?.competitors || [],
    pros: review?.pros || [],
    cons: review?.cons || [],
    criticalFlaws: review?.critical_flaws || [],
    updatedAt: review?.created_at || new Date().toISOString(),
    websiteUrl: tool.affiliate_link || tool.website_url || '#',
  };
}

export async function generateMetadata({ params }: { params: Promise<{ id: string; locale: string }> }) {
  const { id, locale } = await params;
  const tool = await getTool(id, locale);
  if (!tool) return { title: 'Tool Not Found' };

  return {
    title: tool.title, // Use localized title
    description: tool.summary,
  };
}

// ... imports
import { getTranslations } from 'next-intl/server';

// ... existing generateMetadata and getTool functions ...

export default async function ToolPage({ params }: { params: Promise<{ id: string; locale: string }> }) {
  const { id, locale } = await params;
  const t = await getTranslations('ReviewPage'); // Server-side translations
  let tool = null;

  try {
    tool = await getTool(id, locale);
  } catch (err) {
    console.error("Failed to fetch tool data:", err);
  }

  if (!tool) {
    notFound();
  }

  // JSON-LD (keep as is or localize if needed, typically English is fine for strict schema but localized is better)
  const jsonLd = { /* ... */ };

  return (
    <div className="max-w-4xl mx-auto p-6 text-white pb-24">
      {/* ... script ... */}

      <header className="mb-10 text-center">
        <div className="inline-block px-3 py-1 mb-4 text-xs font-mono text-cyan-400 border border-cyan-500/30 rounded-full uppercase tracking-wider">
          {tool.category} {t('reviewLabel')}
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{tool.title}</h1>
        <div className="flex justify-center items-center gap-2">
           <span className="text-2xl font-bold text-yellow-500">{tool.rating}</span>
           <span className="text-slate-500">/ 5.0</span>
        </div>
      </header>

      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="md:col-span-2 space-y-8">
           {/* Smart Score Section */}
           <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-cyan-400">{t('smartScore')}</h2>
                <div className="text-2xl font-mono font-bold text-cyan-400 border border-cyan-500/30 px-3 py-1 rounded">
                  {tool.smartScore.total}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                   <div className="flex justify-between text-sm mb-1 text-slate-400"><span>{t('roi')}</span><span>{tool.smartScore.roi}/10</span></div>
                   <div className="h-2 bg-slate-800 rounded-full"><div className="h-full bg-cyan-600 rounded-full" style={{ width: `${tool.smartScore.roi * 10}%` }}></div></div>
                </div>
                <div>
                   <div className="flex justify-between text-sm mb-1 text-slate-400"><span>{t('privacy')}</span><span>{tool.smartScore.privacy}/10</span></div>
                   <div className="h-2 bg-slate-800 rounded-full"><div className={`h-full rounded-full ${tool.smartScore.privacy < 6 ? 'bg-red-500' : 'bg-cyan-600'}`} style={{ width: `${tool.smartScore.privacy * 10}%` }}></div></div>
                </div>
                <div>
                   <div className="flex justify-between text-sm mb-1 text-slate-400"><span>{t('integration')}</span><span>{tool.smartScore.integration}/10</span></div>
                   <div className="h-2 bg-slate-800 rounded-full"><div className="h-full bg-cyan-600 rounded-full" style={{ width: `${tool.smartScore.integration * 10}%` }}></div></div>
                </div>
              </div>
           </section>

           <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
             <h2 className="text-xl font-bold mb-4 text-cyan-400">{t('analysis')}</h2>
             <p className="text-slate-300 leading-relaxed mb-6">{tool.summary}</p>

             <div className="grid sm:grid-cols-2 gap-6">
               <div>
                 <h3 className="font-bold text-green-400 mb-2 flex items-center gap-2">
                   <span>✓</span> {t('pros')}
                 </h3>
                 <ul className="space-y-2 text-slate-300 text-sm">
                   {tool.pros.map((pro: string) => (
                     <li key={pro} className="flex gap-2">
                       <span className="text-slate-600">•</span> {pro}
                     </li>
                   ))}
                 </ul>
               </div>
               <div>
                 <h3 className="font-bold text-red-400 mb-2 flex items-center gap-2">
                    <span>✕</span> {t('cons')}
                 </h3>
                 <ul className="space-y-2 text-slate-300 text-sm">
                   {tool.cons.map((con: string) => (
                     <li key={con} className="flex gap-2">
                       <span className="text-slate-600">•</span> {con}
                     </li>
                   ))}
                 </ul>
               </div>
             </div>
           </section>

           <section className="bg-red-950/20 border border-red-900/50 rounded-xl p-6 relative group">
             <div className="absolute top-4 right-4 text-red-500 hover:text-red-400 cursor-help" title="We prioritize honest, critical feedback to save you time and money.">
               <span className="text-xs border border-red-500/50 rounded px-2 py-1">?</span>
             </div>
             <h2 className="text-xl font-bold mb-4 text-red-400 flex items-center gap-2">
               {t('criticalFlaws')}
             </h2>
             <ul className="list-disc pl-5 space-y-2 text-red-200">
               {tool.criticalFlaws.map((flaw: string) => (
                 <li key={flaw}>{flaw}</li>
               ))}
             </ul>
             <p className="mt-4 text-xs text-red-400/80 uppercase tracking-widest flex items-center gap-2">
               🛡️ {t('flagged')}
             </p>
           </section>
        </div>

        <div className="space-y-6">
          <TransparencyMeter sourceCount={tool.transparency} />

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center">
            <h3 className="text-slate-400 uppercase text-xs tracking-widest mb-2">{t('pricing')}</h3>
            <p className="text-2xl font-mono font-bold">{tool.price}</p>
          </div>

           {/* Competitors Component */}
          {tool.competitors?.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
               <h3 className="text-slate-400 uppercase text-xs tracking-widest mb-4">{t('competitors')}</h3>
               <div className="space-y-3">
                 {tool.competitors.map((comp: any) => {
                   const compName = typeof comp === 'string' ? comp : comp.name;
                   const slug = `${tool.name.toLowerCase().replace(/\s+/g, '-')}-vs-${compName.toLowerCase().replace(/\s+/g, '-')}`;
                   return (
                     <div key={compName} className="flex flex-col gap-1">
                        <Link
                            href={`/${locale}/compare/${slug}`}
                            className="text-sm font-bold text-cyan-400 hover:text-cyan-300 hover:underline flex items-center gap-1"
                        >
                            <span>vs {compName}</span>
                            <span>→</span>
                        </Link>
                        <span className="text-slate-500 text-xs">{typeof comp === 'string' ? '' : comp.visualComparison}</span>
                     </div>
                   );
                 })}
               </div>
            </div>
          )}

          <a
             href={tool.websiteUrl}
             target="_blank"
             rel="noopener noreferrer"
             className="block w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-lg transition-colors text-center"
           >
            {t('visitWebsite')}
          </a>
        </div>
      </div>
    </div>
  );
}
