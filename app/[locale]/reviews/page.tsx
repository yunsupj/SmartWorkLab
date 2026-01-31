import { redirect } from 'next/navigation';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Analyst } from '@/lib/agents/analyst';
import LabReport from '@/components/reviews/LabReport';
import ReviewForm from '@/components/reviews/ReviewForm';

// Mock list of tools for now (in real app, fetch from DB)
const TOOLS_TO_REVIEW = ['ChatGPT Teams', 'Claude 3.5 Sonnet', 'Cursor AI', 'Midjourney v6'];

export default async function ReviewsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const cookieStore = await cookies();

  // Create Server Client (Auth Guard)
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

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/login?error=unauthorized`);
  }

  // Generate all reports concurrently
  const reportsPromises = TOOLS_TO_REVIEW.map(async (tool) => {
    const report = await Analyst.generateVerificationSummary(tool);
    return { tool, report };
  });

  const toolReports = await Promise.all(reportsPromises);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-12 pb-24">
      <header className="mb-12 max-w-4xl mx-auto text-center">
        <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
          Expert Lab Reports
        </h1>
        <p className="text-slate-400 text-lg">
          Verified insights and community engineering reviews. <br/>
          <span className="text-green-500 font-mono text-sm">● Live Access Granted</span>
        </p>
      </header>

      <div className="max-w-4xl mx-auto space-y-16">
        {toolReports.map(({ tool, report }) => {
           return (
             <section key={tool} id={tool.toLowerCase().replace(/\s+/g, '-')} className="animate-fade-in-up">
                <div className="flex items-center gap-4 mb-6">
                    <h2 className="text-2xl font-bold text-white">{tool}</h2>
                    <span className="px-2 py-1 bg-slate-800 rounded text-xs text-cyan-400 font-mono border border-slate-700">v{report.confidenceScore / 10}</span>
                </div>

                <LabReport summary={report} />

                <ReviewForm toolName={tool} />
             </section>
           );
        })}
      </div>
    </div>
  );
}
