import { notFound } from 'next/navigation';
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
    pros: review?.pros || [],
    cons: review?.cons || [],
    criticalFlaws: review?.critical_flaws || [],
    updatedAt: review?.created_at || new Date().toISOString(),
  };
}

export async function generateMetadata({ params }: { params: Promise<{ id: string; locale: string }> }) {
  const { id, locale } = await params;
  const tool = await getTool(id, locale);
  if (!tool) return { title: 'Tool Not Found' };

  return {
    title: `${tool.name} Review - Honest Analysis`,
    description: tool.summary,
  };
}

export default async function ToolPage({ params }: { params: Promise<{ id: string; locale: string }> }) {
  const { id, locale } = await params;
  const tool = await getTool(id, locale);

  if (!tool) {
    notFound();
  }

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: tool.name,
    description: tool.summary,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: tool.rating,
      reviewCount: tool.reviewCount,
    },
    review: {
      '@type': 'Review',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: tool.rating,
        bestRating: 5,
      },
      author: {
        '@type': 'Organization',
        name: tool.author,
      },
      datePublished: tool.updatedAt,
      reviewBody: tool.summary,
    },
  };

  return (
    <div className="max-w-4xl mx-auto p-6 text-white pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="mb-10 text-center">
        <div className="inline-block px-3 py-1 mb-4 text-xs font-mono text-cyan-400 border border-cyan-500/30 rounded-full uppercase tracking-wider">
          {tool.category} Review
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{tool.name}</h1>
        <div className="flex justify-center items-center gap-2">
           <span className="text-2xl font-bold text-yellow-500">{tool.rating}</span>
           <span className="text-slate-500">/ 5.0</span>
        </div>
      </header>

      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="md:col-span-2 space-y-8">
           <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
             <h2 className="text-xl font-bold mb-4 text-cyan-400">Honest Analysis</h2>
             <p className="text-slate-300 leading-relaxed mb-6">{tool.summary}</p>

             <div className="grid sm:grid-cols-2 gap-6">
               <div>
                 <h3 className="font-bold text-green-400 mb-2 flex items-center gap-2">
                   <span>✓</span> Pros
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
                    <span>✕</span> Cons
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

           <section className="bg-red-950/20 border border-red-900/50 rounded-xl p-6">
             <h2 className="text-xl font-bold mb-4 text-red-400 flex items-center gap-2">
               ⚠️ Critical Flaws Detected
             </h2>
             <ul className="list-disc pl-5 space-y-2 text-red-200">
               {tool.criticalFlaws.map((flaw: string) => (
                 <li key={flaw}>{flaw}</li>
               ))}
             </ul>
             <p className="mt-4 text-xs text-red-400/80 uppercase tracking-widest">
               Flagged by SmartWorkLab Quality Control
             </p>
           </section>
        </div>

        <div className="space-y-6">
          <TransparencyMeter sourceCount={tool.transparency} />

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center">
            <h3 className="text-slate-400 uppercase text-xs tracking-widest mb-2">Pricing</h3>
            <p className="text-2xl font-mono font-bold">{tool.price}</p>
          </div>

          <button className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-lg transition-colors">
            Visit Website
          </button>
        </div>
      </div>
    </div>
  );
}
