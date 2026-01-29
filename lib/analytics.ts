
import { supabase } from '@/lib/supabase';

export async function trackClick(elementId: string, toolId?: string) {
  if (!supabase) return;

  try {
    await supabase.from('click_analytics').insert([{
      element_id: elementId,
      tool_id: toolId
    }]);
  } catch (error) {
    console.error('Failed to track click:', error);
  }
}
