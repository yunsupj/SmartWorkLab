'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export type State = {
  message?: string | null;
  error?: string | null;
  success?: boolean;
};

export async function addToolUsage(prevState: State, formData: FormData): Promise<State> {
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

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Unauthorized: Please login to add tools.' };
  }

  const toolName = formData.get('toolName') as string;
  const monthlyCost = parseFloat(formData.get('monthlyCost') as string);
  const hoursSaved = parseFloat(formData.get('hoursSaved') as string);
  const taskCategory = formData.get('taskCategory') as string || 'General';

  if (!toolName || isNaN(monthlyCost) || isNaN(hoursSaved)) {
    return { error: 'Invalid Input: Please fill all fields correctly.' };
  }

  const { error } = await supabase
    .from('user_tool_usage')
    .insert({
      user_id: user.id,
      tool_name: toolName,
      monthly_cost: monthlyCost,
      hours_saved: hoursSaved,
      task_category: taskCategory
    });

  if (error) {
    console.error('Database Error:', error);
    return { error: 'Failed to save tool data.' };
  }

  revalidatePath('/[locale]/metrics', 'page');
  return { success: true, message: 'Tool added successfully.' };
}
