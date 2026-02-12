
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

async function updateReview(toolName: string, newSummary: string) {
  console.log(`Processing ${toolName}...`);
  // 1. Get Product ID
  const { data: product, error: pError } = await supabase
    .from('products')
    .select('id')
    .eq('name', toolName)
    .single();

  if (pError || !product) {
    console.error(`❌ Product ${toolName} not found:`, pError);
    return;
  }

  // 2. Update English Review
  const { error: rError } = await supabase
    .from('expert_reports')
    .update({ summary: newSummary })
    .eq('product_id', product.id)
    .eq('locale', 'en');

  if (rError) {
    console.error(`❌ Failed to update ${toolName}:`, rError);
  } else {
    console.log(`✅ Successfully updated ${toolName}.`);
  }
}

async function main() {
  console.log('🚀 Starting SEO & CTR Updates...');

  // 1. Perplexity AI (Correction)
  await updateReview(
    'Perplexity AI',
    "We analyzed Perplexity AI and found it revolutionizes search with direct answers, though our lab tests reveal specific accuracy trade-offs you must know."
  );

  // 2. Notion AI (CTR)
  await updateReview(
    'Notion AI',
    "Is Notion AI worth the $10/mo in 2026? We tested it on 50+ docs. See the real ROI, accuracy benchmarks, and why it beats generic ChatGPT for team wikis."
  );

  // 3. Replit (CTR)
  await updateReview(
    'Replit AI',
    "Replit AI Review 2026: Is it worth the hype? We built a full app to test limits. Discover the deployment speed vs. cost analysis before you upgrade."
  );

  // 4. Github Copilot (CTR)
  await updateReview(
    'GitHub Copilot',
    "Github Copilot ROI Analysis: Does it really save 55% of coding time? We broke down the daily efficiency gains for solo devs vs. teams."
  );

  console.log('\n🎉 Updates Complete!');
}

main().catch(console.error);
