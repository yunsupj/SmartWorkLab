'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function updateToolAction(toolId: string, formData: FormData) {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
           // Ignored in Server Actions
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Unauthorized' };
  }

  const toolName = formData.get('toolName') as string;
  const monthlyCost = parseFloat(formData.get('monthlyCost') as string);
  const hoursSaved = parseFloat(formData.get('hoursSaved') as string);
  const taskCategory = formData.get('taskCategory') as string;

  if (!toolName || isNaN(monthlyCost) || isNaN(hoursSaved)) {
      return { success: false, error: 'Invalid Input' };
  }

  const { error } = await supabase
    .from('user_tool_usage')
    .update({
        tool_name: toolName,
        monthly_cost: monthlyCost,
        hours_saved: hoursSaved,
        task_category: taskCategory
    })
    .eq('id', toolId)
    .eq('user_id', user.id); // Strict ownership check

  if (error) {
    console.error('Update failed:', error);
    return { success: false, error: 'Failed to update tool' };
  }

  return { success: true };
}
