'use server';

import { supabase } from '@/lib/supabase';

export async function trackProductConnect(productId: string) {
  if (!productId) return;

  if (!supabase) return;

  // 1. Increment Click Count (Atomic Update)
  const { error } = await supabase.rpc('increment_click_count', { product_id: productId });

  // If RPC doesn't exist yet (migration needed), fallback to manual update (less safe concurrency)
  if (error) {
     const { data } = await supabase.from('products').select('click_count').eq('id', productId).single();
     if (data) {
         await supabase.from('products').update({ click_count: (data.click_count || 0) + 1 }).eq('id', productId);
     }
  }

  // 2. Log Granular Click Event (for Analytics Dashboard)
  await supabase.from('click_analytics').insert({
    element_id: 'visit_website_cta',
    product_id: productId
  });
}

export async function trackProductView(productId: string) {
    if (!productId) return;

    if (!supabase) return;

    // Increment View Count
    const { error } = await supabase.rpc('increment_view_count', { product_id: productId });

    // Fallback
    if (error) {
        const { data } = await supabase.from('products').select('view_count').eq('id', productId).single();
        if (data) {
            await supabase.from('products').update({ view_count: (data.view_count || 0) + 1 }).eq('id', productId);
        }
    }
}
