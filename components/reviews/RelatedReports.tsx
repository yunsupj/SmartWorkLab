import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default async function RelatedReports({ currentToolId, category }: { currentToolId: string; category: string }) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) { try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) } catch {} },
      },
    }
  );

  // Fetch related tools (same category, excluding current)
  // Fallback to random if not enough in category
  let { data: tools } = await supabase
    .from('products')
    .select(`
      id, name, category,
      expert_reports ( title, rating, smart_score )
    `)
    .eq('category', category)
    .neq('id', currentToolId)
    .limit(3);

  // Fallback: If less than 3, just get any other tools
  if (!tools || tools.length < 3) {
      const { data: randomTools } = await supabase
        .from('products')
        .select(`
          id, name, category,
          expert_reports ( title, rating, smart_score )
        `)
        .neq('id', currentToolId)
        .limit(3 - (tools?.length || 0));

      if (randomTools) {
          tools = [...(tools || []), ...randomTools];
      }
  }

  if (!tools || tools.length === 0) return null;

  return (
    <div className="border-t border-slate-800 pt-16">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-bold text-white">Related Expert Reports</h3>
        <Link href="/reviews" className="text-cyan-400 text-sm hover:underline flex items-center gap-1">
            View All Reports <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {tools.map((tool: any) => {
           // Safe Accessors
           const report = tool.expert_reports?.[0] || {};
           const title = report.title || `${tool.name} Review`;
           const score = report.smart_score?.total || Math.round(report.rating * 20) || 85;

           return (
             <Link
                key={tool.id}
                href={`/reviews/${tool.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="group block bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-cyan-500/50 hover:bg-slate-800 transition-all"
             >
                <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">{tool.category}</span>
                    <div className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs font-bold text-cyan-400 group-hover:text-cyan-300">
                        {score}/100
                    </div>
                </div>
                <h4 className="text-lg font-bold text-slate-200 group-hover:text-white mb-2 line-clamp-1">
                    {tool.name}
                </h4>
                <p className="text-sm text-slate-400 line-clamp-2">
                    {title}
                </p>
                <div className="mt-4 flex items-center gap-2 text-cyan-500 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                    Read Report <ArrowRight className="w-4 h-4" />
                </div>
             </Link>
           );
        })}
      </div>
    </div>
  );
}
