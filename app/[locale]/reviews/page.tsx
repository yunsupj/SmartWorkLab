import { Link } from '@/i18n/routing';

export default function ReviewsIndex() {
  return (
    <div className="max-w-4xl mx-auto p-8 text-white">
      <h1 className="text-3xl font-bold mb-6">AI Tool Reviews</h1>
      <p className="text-slate-400 mb-8">Comprehensive, honest analysis of the latest AI engineering tools.</p>

      <div className="grid gap-4">
        <Link href="/reviews/cursor-ai" className="block bg-slate-900 border border-slate-800 p-6 rounded hover:border-cyan-500 transition-colors">
          <h2 className="text-xl font-bold text-cyan-400">Cursor AI Review</h2>
          <p className="text-slate-400">The AI code editor that actually works.</p>
        </Link>
        {/* specific list can be fetched dynamically later */}
      </div>
    </div>
  );
}
