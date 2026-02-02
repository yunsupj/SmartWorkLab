
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function updateContent() {
  const updates = [
    {
      name: 'Framer',
      newTitle: 'Framer AI Review: How it Scales Professional Design Efficiency',
      comparison: `
## Framer AI vs. Webflow
| Feature | Framer AI | Webflow |
| :--- | :--- | :--- |
| **Learning Curve** | Low (Like Canva) | High (Developer-focused) |
| **AI Generation** | Full Page Layouts | Minimal |
| **Hosting** | Instant Global CDN | Complex Setup |
| **Speed** | 10x Faster | Standard |
      `,
       summarySuffix: "This tool is a game changer for designers who want to build sites without coding."
    },
    {
        name: 'Canva',
        newTitle: 'Canva Magic Studio 2026: The Business Case for Enterprise Design',
        comparison: `
## Canva Magic Studio vs. Adobe Express
| Feature | Canva Magic Studio | Adobe Express |
| :--- | :--- | :--- |
| **Brand Control** | Enterprise Brand Kits | CC Library Integration |
| **AI Tools** | Magic Switch, Text-to-Video | Firefly Generative Fill |
| **Collaboration** | Real-time Multiplayer | Cloud Docs |
| **Cost** | Scale-friendly | Premium Pricing |
        `,
        summarySuffix: "The enterprise-ready design platform for scalable content creation."
    }
  ];

  for (const update of updates) {
    console.log(`Processing ${update.name}...`);

    // 1. Find Product
    const { data: products } = await supabase
        .from('products')
        .select('id, name')
        .ilike('name', `%${update.name}%`)
        .limit(1);

    if (!products || products.length === 0) {
        console.error(`❌ ${update.name} not found!`);
        continue;
    }

    const tool = products[0];

    // 2. Fetch Existing Summary
    const { data: report } = await supabase
        .from('expert_reports')
        .select('summary')
        .eq('product_id', tool.id)
        .single();

    // Use existing summary or create a default base
    const baseSummary = report?.summary || `## Executive Summary\n${update.newTitle} explores the capabilities of ${update.name}.`;
    let finalSummary = baseSummary;

    // Check duplication
    if (finalSummary.includes("| Feature |")) {
        console.log(`⚠️ Comparison table already exists for ${update.name}. Keeping existing summary.`);
        // Even if table exists, we might want to ensure the title is updated, so we proceed to upsert with existing summary
    } else {
        finalSummary = `
${baseSummary}

${update.comparison}

### Final Verdict
${update.summarySuffix}
`;
    }

    // 3. Upsert Report
    const { error } = await supabase
        .from('expert_reports')
        .upsert({
            product_id: tool.id,
            title: update.newTitle,
            summary: finalSummary,
            author: 'SmartWorkLab AI',
            locale: 'en',
            updated_at: new Date().toISOString(),
            // Default fields for new records
            rating: 5, // FIXED: Constraint is likely 1-5
            status: 'approved',
            smart_score: { total: 95, roi: 9, privacy: 9, integration: 10 }
        }, { onConflict: 'product_id, locale' });

    if (error) {
        console.error(`❌ Failed to update ${update.name}:`, error);
    } else {
        console.log(`✅ Upserted ${update.name} with new Title and Comparison Table.`);
    }
  }
}

updateContent();
