
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function inspectDetailed() {
  const { data: products } = await supabase.from('products').select('*').ilike('name', '%cursor%');

  for (const p of products || []) {
    console.log(`\nPRODUCT: ${p.id} - ${p.name}`);
    const { data: reports } = await supabase.from('expert_reports').select('*').eq('product_id', p.id);

    reports?.forEach(r => {
      console.log(`  REPORT ID: ${r.id}`);
      console.log(`  AUTHOR: ${r.author}`);
      console.log(`  SUMMARY: ${r.summary?.substring(0, 50)}...`);
      console.log(`  STATUS: ${r.status}`);
    });
  }
}

inspectDetailed();
