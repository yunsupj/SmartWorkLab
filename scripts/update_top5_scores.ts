import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Target Slugs for Top 5 pages (Notion AI, Replit, ChatGPT Teams, Claude 3, Github Copilot)
const TARGETS = [
    { slug: 'notion-ai', scores: { roi: 9.5, privacy: 8.5, integration: 9.8 } }, // High integration, high ROI
    { slug: 'replit', scores: { roi: 9.8, privacy: 8.2, integration: 9.0 } },     // Highest ROI for code
    { slug: 'chatgpt-teams', scores: { roi: 9.2, privacy: 9.5, integration: 8.8 } }, // High Privacy
    { slug: 'claude-3', scores: { roi: 9.6, privacy: 9.2, integration: 8.5 } },   // High reasoning ROI
    { slug: 'github-copilot', scores: { roi: 9.4, privacy: 8.8, integration: 9.9 } } // Highest Integration
];

async function updateScores() {
  console.log('Fetching target products...');

  for (const target of TARGETS) {
     // Find the product by slug/name approximation
     const { data: products, error: productError } = await supabase
        .from('products')
        .select('id, name')
        .ilike('name', `%${target.slug.replace(/-/g, ' ')}%`)
        .limit(1);

     if (productError || !products || products.length === 0) {
         console.warn(`Could not find product for slug: ${target.slug}`);
         continue;
     }

     const product = products[0];
     const totalScore = parseFloat(((target.scores.roi + target.scores.privacy + target.scores.integration) / 3).toFixed(1));

     const newSmartScore = {
         roi: target.scores.roi,
         privacy: target.scores.privacy,
         integration: target.scores.integration,
         total: totalScore
     };

     // Update expert_reports for this product across all locales
     const { data, error } = await supabase
        .from('expert_reports')
        .update({
            smart_score: newSmartScore,
            rating: Math.round(totalScore / 2) // Round to integer since the column requires it
        })
        .eq('product_id', product.id)
        .select('id, locale, product_id');

     if (error) {
         console.error(`Error updating scores for ${product.name}:`, error.message);
     } else {
         console.log(`Successfully updated ${product.name} (${data?.length} reports). New Total: ${totalScore}`);
     }
  }

  console.log('Done.');
}

updateScores().catch(console.error);
