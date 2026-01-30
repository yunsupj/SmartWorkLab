
import { supabase } from '@/lib/supabase';
import { getTranslations } from 'next-intl/server';
import { notFound, redirect } from 'next/navigation';

// Quick & Dirty Auth Check (Middleware is better, but this works for prototype)
// In production, use Supabase Auth Middleware protection
const ADMIN_EMAILS = ['admin@smartworklab.com', 'yuun@example.com']; // Replace with real admin logic



export default async function AdminPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('Index'); // Reusing general strings for now

  if (!supabase) return <div className="p-8">Supabase not configured</div>;

  // 1. Fetch Metrics
  const { count: leadCount } = await supabase.from('leads').select('*', { count: 'exact', head: true });
  const { count: toolCount } = await supabase.from('tools').select('*', { count: 'exact', head: true });
  const { count: reviewCount } = await supabase.from('expert_reports').select('*', { count: 'exact', head: true });

  // 2. Fetch Recent Leads
  const { data: leads } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);

  // 3. Fetch Top Clicks (Mock Logic for now if analytics is empty)
  const { data: topClicks } = await supabase
     .from('click_analytics')
     .select('element_id') // We would need grouping here, but Supabase client simple query doesn't do group by easily without RPC
     .limit(50);

  // Client-side simple aggregation simulation (since volume is low)
  const clickMap: Record<string, number> = {};
  topClicks?.forEach((c) => {
      clickMap[c.element_id] = (clickMap[c.element_id] || 0) + 1;
  });
  const sortedClicks = Object.entries(clickMap).sort((a,b) => b[1] - a[1]).slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto p-8 text-white">
      <header className="mb-12 flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold mb-2">Operator Dashboard</h1>
            <p className="text-slate-400">Mission Command Center for SmartWorkLab</p>
        </div>
        <div className="bg-green-900/30 text-green-400 px-4 py-2 rounded-full border border-green-800 text-sm font-bold">
            System Operational
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-12">
        <KpiCard label="Total Leads" value={leadCount || 0} icon="📫" />
        <KpiCard label="Tools Database" value={toolCount || 0} icon="🧰" />
        <KpiCard label="Published Reviews" value={reviewCount || 0} icon="📝" />
        <KpiCard label="Total Clicks" value={topClicks?.length || 0} icon="🖱️" />
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Recent Leads */}
        <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span>Recent Leads (ROI Reports)</span>
            </h2>
            <div className="overflow-x-auto">
                <table className="w-full text-sm item-center">
                    <thead>
                        <tr className="text-left text-slate-500 border-b border-slate-800">
                            <th className="pb-2">Email</th>
                            <th className="pb-2">Source</th>
                            <th className="pb-2">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                        {leads?.map(lead => (
                            <tr key={lead.id} className="group hover:bg-slate-800/50 transition-colors">
                                <td className="py-3 font-mono text-cyan-400">{lead.email}</td>
                                <td className="py-3 text-slate-400">{lead.source}</td>
                                <td className="py-3 text-slate-500">{new Date(lead.created_at).toLocaleDateString()}</td>
                            </tr>
                        ))}
                         {(!leads || leads.length === 0) && (
                            <tr><td colSpan={3} className="py-4 text-center text-slate-600">No leads yet.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </section>

        {/* Analytics Snapshot */}
        <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Top Conversion Actions</h2>
            <div className="space-y-4">
                {sortedClicks.length > 0 ? sortedClicks.map(([id, count], i) => (
                    <div key={id} className="flex items-center justify-between p-3 bg-slate-950 rounded border border-slate-800">
                        <div className="flex items-center gap-3">
                            <span className="font-mono text-slate-500 w-6">#{i+1}</span>
                            <span className="font-bold text-slate-300">{id}</span>
                        </div>
                        <span className="bg-cyan-900/30 text-cyan-400 px-2 py-1 rounded text-xs font-mono">{count} clicks</span>
                    </div>
                )) : (
                    <div className="text-slate-600 text-center py-8">No interaction data recorded yet.</div>
                )}
            </div>
        </section>
      </div>
    </div>
  );
}

function KpiCard({ label, value, icon }: any) {
    return (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex items-center justify-between">
            <div>
                <p className="text-slate-500 text-xs uppercase tracking-widest mb-1">{label}</p>
                <p className="text-3xl font-bold text-white">{value}</p>
            </div>
            <div className="text-4xl opacity-20 grayscale">{icon}</div>
        </div>
    )
}
