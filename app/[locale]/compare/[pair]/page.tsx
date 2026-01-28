import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Link } from '@/i18n/routing';

interface ToolComparisonData {
  name: string;
  price: string;
  smartScore: number;
  pros: string[];
  cons: string[];
  features: { name: string; value: boolean | string }[];
}

// Mock Data fallbacks if tools aren't in DB yet
const getMockTool = (slug: string): ToolComparisonData => {
  if (slug.includes('cursor')) {
    return {
      name: 'Cursor AI',
      price: '$20/mo',
      smartScore: 8.3,
      pros: ['Codebase Indexing', 'VS Code Native'],
      cons: ['Privacy Concerns', 'Expensive'],
      features: [
        { name: 'Autocomplete', value: true },
        { name: 'Chat', value: true },
        { name: 'Context Window', value: '10k files' },
      ]
    };
  }
  return {
    name: 'GitHub Copilot',
    price: '$10/mo',
    smartScore: 7.5,
    pros: ['Cheaper', 'Enterprise Ready'],
    cons: ['Less Context', 'No Chat Edit'],
    features: [
      { name: 'Autocomplete', value: true },
      { name: 'Chat', value: true },
      { name: 'Context Window', value: 'Active File' },
    ]
  };
}

export async function generateMetadata({ params }: { params: Promise<{ pair: string }> }) {
  const { pair } = await params;
  const [slug1, slug2] = pair.split('-vs-');
  const t1 = getMockTool(slug1).name;
  const t2 = getMockTool(slug2).name;

  return {
    title: `${t1} vs ${t2}: 2024 Cost & Feature Battle`,
    description: `Compare ${t1} and ${t2} side-by-side. See which AI tool saves you more money. Honest analysis of features, pricing, and true cons.`,
    keywords: ['AI cost comparison', 'Save money on AI', 'AI tools comparison', t1, t2],
  };
}

export default async function ComparisonPage({ params }: { params: Promise<{ pair: string }> }) {
  const { pair } = await params;
  const [slug1, slug2] = pair.split('-vs-');

  if (!slug1 || !slug2) return notFound();

  // Ideally fetch from Supabase by slug/name. Using mock for 'Deep Battle' template
  const tools = [getMockTool(slug1), getMockTool(slug2)];

  return (
    <div className="max-w-6xl mx-auto p-6 pb-24 text-white">
      <header className="text-center mb-16">
        <div className="inline-block px-3 py-1 mb-4 text-xs font-mono text-cyan-400 border border-cyan-500/30 rounded-full uppercase tracking-wider">
          Deep Battle Analysis
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          {tools[0].name} vs {tools[1].name}
        </h1>
        <p className="text-xl text-slate-400">Which AI tool actually saves you more time?</p>
      </header>

      <div className="grid md:grid-cols-2 gap-8 mb-16">
        {tools.map((tool, idx) => (
          <div key={idx} className={`bg-slate-900 border ${idx === 0 ? 'border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.1)]' : 'border-purple-500/50 shadow-[0_0_30px_rgba(168,85,247,0.1)]'} rounded-2xl p-8 relative overflow-hidden`}>
             <div className="absolute top-0 right-0 p-4 opacity-10 text-9xl font-bold select-none">
               {idx + 1}
             </div>

             <h2 className="text-3xl font-bold mb-2">{tool.name}</h2>
             <p className="text-2xl font-mono mb-6">{tool.price}</p>

             <div className="mb-8">
               <div className="text-sm text-slate-400 mb-1">Smart Score</div>
               <div className="flex items-end gap-2">
                 <span className={`text-4xl font-bold ${tool.smartScore > 8 ? 'text-green-400' : 'text-yellow-400'}`}>{tool.smartScore}</span>
                 <span className="text-slate-500 mb-1">/ 10</span>
               </div>
             </div>

             <ul className="space-y-3 mb-8">
               {tool.features.map(f => (
                 <li key={f.name} className="flex justify-between border-b border-slate-800 pb-2">
                   <span className="text-slate-400">{f.name}</span>
                   <span className="font-bold">{f.value === true ? '✅' : f.value}</span>
                 </li>
               ))}
             </ul>

             <div className="space-y-4">
               <div>
                 <h4 className="font-bold text-green-400 text-sm uppercase tracking-wider mb-2">Winners</h4>
                 <ul className="text-sm space-y-1">
                   {tool.pros.map(p => <li key={p}>+ {p}</li>)}
                 </ul>
               </div>
               <div>
                 <h4 className="font-bold text-red-400 text-sm uppercase tracking-wider mb-2">Dealbreakers</h4>
                 <ul className="text-sm space-y-1">
                   {tool.cons.map(c => <li key={c}>- {c}</li>)}
                 </ul>
               </div>
             </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-12 text-center max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">The Verdict</h2>
        <p className="text-slate-300 text-lg leading-relaxed mb-8">
          If you need <strong className="text-white">deep codebase understanding</strong> and spend hours debugging,
          <span className="text-cyan-400 font-bold"> {tools[0].name}</span> is the winner despite the higher price.
          For <strong className="text-white">simple autocomplete</strong> at a lower cost, stick with {tools[1].name}.
        </p>
        <Link
          href={`/reviews/${slug1.includes('cursor') ? 'cursor-ai' : 'github-copilot'}`} // Rough linking for demo
          className="inline-block bg-white text-slate-900 font-bold py-4 px-10 rounded-full hover:bg-cyan-50 transition-colors"
        >
          Get the Winner: {tools[0].name} →
        </Link>
      </div>
    </div>
  );
}
