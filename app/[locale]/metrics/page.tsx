import { redirect } from 'next/navigation';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Dashboard from '@/components/dashboard/Dashboard';
import { Analyst, UsageData } from '@/lib/agents/analyst';

export default async function MetricsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const cookieStore = await cookies();

  // Create Server Client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
           // Ignored in Server Components
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/login?error=unauthorized`);
  }

  // Fetch Usage Data
  const { data: usageData, error } = await supabase
    .from('user_tool_usage')
    .select('*')
    .eq('user_id', user.id);

  if (error) {
      console.error('Error fetching usage data:', error);
      // Handle error gracefully or redirect
  }

  // Calculate Reports via Agent
  const report = Analyst.calculateROI((usageData as UsageData[]) || []);

  return <Dashboard user={user} report={report} />;
}
