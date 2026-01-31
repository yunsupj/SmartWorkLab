
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing env vars');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanupData() {
  console.log('--- Cleaning up Cursor Duplicates ---');
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name')
    .ilike('name', '%cursor%');

  if (error) {
     console.error('Fetch error:', error);
     return;
  }

  for (const p of products || []) {
    const { data: reports } = await supabase
      .from('expert_reports')
      .select('id')
      .eq('product_id', p.id);

    if (reports && reports.length > 0) {
      console.log(`[KEEP] "${p.name}" (${p.id}) has ${reports.length} report(s).`);
      // Optional: Update name to 'Cursor AI' if it isn't already, for consistency
      if (p.name !== 'Cursor AI') {
         console.log(`Renaming "${p.name}" to "Cursor AI"`);
         await supabase.from('products').update({ name: 'Cursor AI' }).eq('id', p.id);
      }
    } else {
      console.log(`[DELETE] "${p.name}" (${p.id}) has NO reports.`);
      const { error: delError } = await supabase.from('products').delete().eq('id', p.id);
      if (delError) console.error('Delete failed:', delError);
      else console.log('Deleted successfully.');
    }
  }
}

cleanupData();
