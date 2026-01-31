import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Use service role key to bypass RLS for cleanup
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function cleanupDuplicates() {
  console.log('--- Cleaning up Duplicate Expert Reports ---');

  // 1. Find Product ID for "Cursor AI"
  const { data: products, error: pError } = await supabase
    .from('products')
    .select('id, name')
    .ilike('name', 'Cursor AI')
    .single();

  if (pError || !products) {
    console.error('Product "Cursor AI" not found:', pError);
    return;
  }

  const productId = products.id;
  console.log(`Target Product: ${products.name} (${productId})`);

  // 2. Fetch all reports for this product
  const { data: reports, error: rError } = await supabase
    .from('expert_reports')
    .select('id, created_at, locale')
    .eq('product_id', productId)
    .order('created_at', { ascending: false }); // Newest first

  if (rError || !reports) {
    console.error('Error fetching reports:', rError);
    return;
  }

  console.log(`Found ${reports.length} reports for Cursor AI.`);

  // 3. Identify duplicates per locale
  const seenLocales = new Set<string>();
  const toDelete: string[] = [];

  for (const report of reports) {
    if (seenLocales.has(report.locale)) {
      toDelete.push(report.id);
    } else {
      seenLocales.add(report.locale);
    }
  }

  // 4. Delete duplicates
  if (toDelete.length > 0) {
    console.log(`Deleting ${toDelete.length} duplicate reports...`);
    const { error: dError } = await supabase
      .from('expert_reports')
      .delete()
      .in('id', toDelete);

    if (dError) {
      console.error('Error deleting duplicates:', dError);
    } else {
      console.log('✅ Duplicates deleted successfully.');
    }
  } else {
    console.log('✅ No duplicates found.');
  }
}

cleanupDuplicates();
