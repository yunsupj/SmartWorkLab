import { Link } from '@/i18n/routing';
import TransparencyMeter from './TransparencyMeter';

interface Tool {
  id: string; // Changed from number to string (uuid)
  name: string;
  category: string;
  rating: number;
  transparency: number;
  summary: string;
}

export default function TopTenPicks({ initialTools = [] }: { initialTools?: Tool[] }) {
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
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <span className="text-cyan-400">#</span> Top Picks of the Month
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool, index) => (
          <div key={tool.id} className="bg-slate-900 border border-slate-800 rounded-lg p-6 hover:border-cyan-500/30 transition-all hover:-translate-y-1">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-cyan-500 font-mono text-xl mr-2">#{index + 1}</span>
                <h3 className="text-xl font-bold text-white inline">{tool.name}</h3>
                <span className="block text-xs text-slate-500 uppercase mt-1">{tool.category}</span>
              </div>
              <div className="bg-slate-800 px-2 py-1 rounded text-sm font-bold text-cyan-400">
                {tool.rating}
              </div>
            </div>

            <p className="text-slate-400 text-sm mb-4 line-clamp-2">
              {tool.summary}
            </p>

            <div className="mb-4">
              <TransparencyMeter sourceCount={tool.transparency} />
            </div>

            <Link
        href={`/reviews/${tool.id}`}
        className="text-cyan-400 text-sm font-bold hover:text-cyan-300 transition-colors flex items-center gap-1"
      >
        Read Honest Review →
      </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
