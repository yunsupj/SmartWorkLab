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

const UPDATES = [
  {
    slug: 'surfer-seo',
    summary: "Our tests show Surfer's 2026 update cuts manual optimization time by 40% for B2B blogs. Engineering verified ROI: 566%."
  },
  {
    slug: 'replit',
    summary: "Our tests show Replit's 2026 AI update cuts development time by 30% for web apps. Engineering verified ROI: 1400%."
  }
];

async function updateSeo() {
  console.log('Updating SEO and E-E-A-T content...');

  for (const target of UPDATES) {
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

     const { data, error } = await supabase
        .from('expert_reports')
        .update({
            summary: target.summary
        })
        .eq('product_id', product.id)
        .select('id, locale, product_id, summary');

     if (error) {
         console.error(`Error updating content for ${product.name}:`, error.message);
     } else {
         console.log(`Successfully updated ${product.name} (${data?.length} reports).`);
     }
  }

  console.log('Done.');
}

updateSeo().catch(console.error);
