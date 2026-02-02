
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTools() {
  const tools = ['Framer', 'Canva']; // Use simpler names for wider matching

  for (const toolName of tools) {
    // 1. Get Product ID
    const { data: products, error: productError } = await supabase
      .from('products')
      .select('id, name')
      .ilike('name', `%${toolName}%`);

    if (productError || !products || products.length === 0) {
      console.log(`❌ Product not found: ${toolName}`);
      continue;
    }

    const product = products[0]; // Take the first match
    console.log(`✅ Product found: ${product.name} (${product.id})`);

    // 2. Get Expert Report
    const { data: report, error: reportError } = await supabase
      .from('expert_reports')
      .select('title, summary')
      .eq('product_id', product.id)
      .single();

    if (reportError || !report) {
      console.log(`   ⚠️ No Expert Report found for ${toolName}`);
    } else {
      console.log(`   📄 Current Title: ${report.title}`);
      console.log(`   📝 Summary Length: ${report.summary?.length} chars`);
    }
  }
}

checkTools();
