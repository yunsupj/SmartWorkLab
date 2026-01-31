
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function auditData() {
  console.log('--- Auditing Products Schema/Data ---');
  // Hack to see columns: select * limit 1
  const { data: products, error: pError } = await supabase.from('products').select('*').limit(1);
  if (pError) console.error('Product fetch error:', pError);
  else if (products && products.length > 0) {
      console.log('Product Columns:', Object.keys(products[0]));
      console.log('Sample Product:', products[0]);
  } else {
      console.log('No products found.');
  }

  console.log('\n--- Auditing Expert Reports Schema/Data ---');
  const { data: reports, error: rError } = await supabase.from('expert_reports').select('*').limit(1);
  if (rError) console.error('Report fetch error:', rError);
  else if (reports && reports.length > 0) {
      console.log('Report Columns:', Object.keys(reports[0]));
      console.log('Sample Report:', reports[0]);
      console.log('Smart Score Structure:', reports[0].smart_score);
  } else {
      console.log('No reports found.');
  }
}

auditData();
