import Link from 'next/link';
import TransparencyMeter from './TransparencyMeter';

// Mock Data
const TOOLS = [
  { id: 1, name: 'Cursor AI', category: 'Coding', rating: 4.8, transparency: 8, summary: 'The best AI code editor, period.' },
  { id: 2, name: 'Perplexity', category: 'Search', rating: 4.7, transparency: 9, summary: 'Replaces Google for 90% of queries.' },
  { id: 3, name: 'Midjourney', category: 'Image', rating: 4.9, transparency: 5, summary: 'Unmatched image quality, terrible UX.' },
  // ... more tools
];

export default function TopTenPicks() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <span className="text-cyan-400">#</span> Top Picks of the Month
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TOOLS.map((tool, index) => (
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
              href={`/tool/${tool.id}`}
              className="block w-full text-center bg-slate-800 hover:bg-slate-700 text-white text-sm py-2 rounded transition-colors"
            >
              Read Honest Review
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
