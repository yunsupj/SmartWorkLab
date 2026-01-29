
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { FinalPost } from '../lib/agents/types';

// Simple .env.local loader
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

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing Supabase Credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
const INPUT_FILE = path.join(process.cwd(), 'data/top_50_generated.json');

async function main() {
  console.log('🚀 Starting Bulk Insert...');

  if (!fs.existsSync(INPUT_FILE)) {
    console.error(`❌ Data file not found: ${INPUT_FILE}`);
    process.exit(1);
  }

  const posts: FinalPost[] = JSON.parse(fs.readFileSync(INPUT_FILE, 'utf-8'));
  console.log(`📋 Loaded ${posts.length} posts to insert.`);

  for (const post of posts) {
    const { toolData, analysis, drafts } = post;
    console.log(`\nProcessing: ${toolData.name}`);

    // 1. Upsert Product (Manual Check to avoid unique constraint error)
    let productId: string | null = null;

    // Check if product exists
    const { data: existingProduct } = await supabase
        .from('products')
        .select('id')
        .eq('name', toolData.name)
        .single();

    if (existingProduct) {
        productId = existingProduct.id;
        // Update existing (optional, but good for syncing)
        await supabase.from('products').update({
            category: analysis.category,
            description: toolData.description,
            website_url: toolData.websiteUrl,
        }).eq('id', productId);
    } else {
        // Insert new
        const { data: newProduct, error: insertError } = await supabase
            .from('products')
            .insert({
                name: toolData.name,
                category: analysis.category,
                description: toolData.description,
                price_model: 'Freemium',
                website_url: toolData.websiteUrl,
                external_link_url: toolData.websiteUrl, // Standardized
                affiliate_link: null
            })
            .select('id')
            .single();

        if (insertError) {
             console.error(`❌ Failed to insert product ${toolData.name}: ${insertError.message}`);
             continue;
        }
        productId = newProduct?.id;
    }

    if (!productId) continue;
    const tool = { id: productId }; // Mock object for next steps

    // 2. Insert Reviews
    for (const locale of ['en', 'ko']) {
        const draft = drafts[locale as keyof typeof drafts];
        if (!draft) continue;

        const { error: reviewError } = await supabase
          .from('reviews')
          .upsert({
            product_id: tool.id,
            locale: locale,
            title: draft.title,
            summary: draft.summary,
            body: draft.body,
            pros: analysis.pros,
            cons: analysis.cons,
            critical_flaws: analysis.criticalFlaws,
            smart_score: analysis.smartScore,
            competitors: analysis.competitors,
            status: 'approved', // Auto-approve for seed
            rating: Math.round((analysis.smartScore?.total || 7) / 2) // Rough 5-star map
          }, { onConflict: 'product_id, locale' }); // Composite key match

        if (reviewError) {
             console.error(`   ❌ Failed to insert ${locale} review: ${reviewError.message}`);
        } else {
             console.log(`   ✅ Inserted ${locale} review`);
        }
    }

    // 3. Insert Metrics (Initial Price)
    // Only if pricing is a number, simplifying for seed
    // Skipping complex metric logic for now
  }

  console.log('\n🎉 Bulk Insert Complete!');
}

main().catch(console.error);
