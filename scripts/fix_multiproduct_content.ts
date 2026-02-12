
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load env
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf-8');
  envConfig.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
      process.env[key.trim()] = value.trim();
    }
  });
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
  console.log('🚀 Fixing Perplexity AI Content...');

  // 1. Get Product ID
  const { data: product, error: pError } = await supabase
    .from('products')
    .select('id')
    .eq('name', 'Perplexity AI')
    .single();

  if (pError || !product) {
    console.error('❌ Product not found:', pError);
    return;
  }

  console.log(`✅ Found Product ID: ${product.id}`);

  // 2. Update English Review
  const newSummary = "We analyzed Perplexity AI and found it revolutionizes search with direct answers, though our lab tests reveal specific accuracy trade-offs you must know.";

  const { error: rError } = await supabase
    .from('expert_reports')
    .update({ summary: newSummary })
    .eq('product_id', product.id)
    .eq('locale', 'en');

  if (rError) {
    console.error('❌ Failed to update review:', rError);
  } else {
    console.log('✅ Successfully updated Perplexity AI English summary.');
  }
}

main().catch(console.error);
