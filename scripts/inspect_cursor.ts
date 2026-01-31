
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

async function inspectData() {
  console.log('--- Searching for products matching "cursor" ---');
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, created_at')
    .ilike('name', '%cursor%');

  if (error) {
    console.error('Error fetching products:', error);
    return;
  }

  console.log('Products found:', products);

  for (const p of products || []) {
    console.log(`\nChecking reports for Product ID: ${p.id} (${p.name})`);
    const { data: reports, error: rError } = await supabase
      .from('expert_reports')
      .select('*')
      .eq('product_id', p.id);

    if (rError) console.error(rError);
    console.log('Reports:', reports);
  }
}

inspectData();
