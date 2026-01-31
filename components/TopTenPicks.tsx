import { Link } from '@/i18n/routing';
import TransparencyMeter from './TransparencyMeter';
import { getTranslations } from 'next-intl/server';

interface Tool {
  id: string; // Changed from number to string (uuid)
  name: string;
  category: string;
  rating: number;
  transparency: number;
  summary: string;
}

export default async function TopTenPicks({ initialTools = [] }: { initialTools?: Tool[] }) {
  const t = await getTranslations('TopTenPicks');
  const tools = initialTools;

  if (!tools || tools.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-900 rounded-lg border border-slate-800">
        <p className="text-slate-400 mb-2">No tools seeded yet.</p>
        <p className="text-xs text-slate-600">Run npm run seed</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-end justify-between mb-8">
        <div>
           <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
            <span className="w-2 h-8 bg-cyan-500 rounded-full"></span>
            AI Spotlights
           </h2>
           <p className="text-slate-400">Top Picks of the Month. Curated for performance.</p>
        </div>
        <Link href="/reviews" className="hidden md:block text-cyan-400 font-bold hover:text-cyan-300 transition-colors">
            View All Reports &rarr;
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool, index) => (
          <div key={tool.id} className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-xl p-6 hover:border-cyan-500/30 transition-all hover:-translate-y-1 group relative overflow-hidden">
             {/* Spotlight Effect */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none group-hover:bg-cyan-500/10 transition-colors"></div>

            <div className="flex justify-between items-start mb-4 relative z-10">
              <div>
                <span className="text-cyan-500 font-mono text-xl mr-2">#{index + 1}</span>
                <h3 className="text-xl font-bold text-white inline">{tool.name}</h3>
                <span className="block text-xs text-slate-500 uppercase mt-1 tracking-wider">{tool.category}</span>
              </div>
              <div className="bg-slate-800/80 backdrop-blur-sm px-2 py-1 rounded text-sm font-bold text-cyan-400 border border-slate-700">
                {tool.rating}
              </div>
            </div>

            <p className="text-slate-400 text-sm mb-6 line-clamp-2 relative z-10 h-10">
              {tool.summary || `${tool.name} is a top-rated AI tool for ${tool.category}.`}
            </p>

            {/* CTA Button */}
            <Link
                href={`/reviews/${tool.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="block w-full text-center bg-slate-800 hover:bg-slate-700 text-white font-medium py-2 rounded-lg border border-slate-700 hover:border-cyan-500/50 transition-all text-sm group-hover:shadow-[0_0_15px_rgba(6,182,212,0.1)]"
            >
                Read Full Lab Report
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center md:hidden">
         <Link href="/reviews" className="text-cyan-400 font-bold hover:text-cyan-300 transition-colors">
            View All Reports &rarr;
        </Link>
      </div>
    </div>
  );
}
