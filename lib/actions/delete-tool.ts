'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function deleteToolEntry(toolId: string) {
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

  const { error } = await supabase
    .from('user_tool_usage')
    .delete()
    .eq('id', toolId)
    .eq('user_id', user.id); // Strict ownership check

  if (error) {
    console.error('Delete failed:', error);
    return { success: false, error: 'Failed to delete tool' };
  }

  return { success: true };
}
