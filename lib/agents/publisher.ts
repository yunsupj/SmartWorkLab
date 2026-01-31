import { FinalPost } from './types';
import { supabaseAdmin } from '../supabase';
// import simpleGit from 'simple-git';
// import fs from 'fs/promises';
// import path from 'path';

export class PublisherAgent {
  async publish(post: FinalPost) {
    console.log(`🚀 Publisher Agent: Publishing ${post.analysis.toolName}...`);

    // 1. Save to Supabase
    if (supabaseAdmin) {
      // First, find the product_id if not present
      let toolId = undefined;

      const { data: product } = await supabaseAdmin
          .from('products')
          .select('id')
          .ilike('name', post.analysis.toolName)
          .single();

      if (product) {
          toolId = product.id;
      } else {
          console.warn(`⚠️ Tool "${post.analysis.toolName}" not found in products table. Adding placeholder...`);
          // Optional: Insert into products if not exist, but for now we warn
      }

      if (!toolId) {
          console.error("❌ Cannot publish review: Product ID missing.");
          return;
      }

      // Upsert EN Review
      const { error: upsertError } = await supabaseAdmin
        .from('expert_reports')
        .upsert({
          product_id: toolId,
          locale: 'en', // Currently pipeline processes one tool, multiple drafts.
                        // If we want to support multiple locales, we need to iterate post.drafts
          title: post.drafts.en?.title || `${post.analysis.toolName} Review`,
          summary: post.drafts.en?.summary || post.analysis.summary,
          rating: post.analysis.smartScore?.total ? Math.round((post.analysis.smartScore.total / 10) * 5 * 10) / 10 : 0,
          status: 'published', // Auto-publish for now
          smart_score: post.analysis.smartScore,
          critical_flaws: post.analysis.criticalFlaws,
          competitors: post.analysis.competitors,
          pros: post.analysis.pros,
          cons: post.analysis.cons,
          author: 'SmartWorkLab AI',
          // We can also upsert KO version if we iterate. For MVP, let's just do EN or primary.
        }, { onConflict: 'product_id, locale' });

      if (upsertError) {
          console.error('Supabase Upsert Error:', upsertError);
      } else {
          console.log(`✅ Upserted expert_report for ${post.analysis.toolName} (EN)`);
      }

    } else {
      console.log('⚠️ Publisher Agent: Supabase keys missing, skipping DB write.');
    }

    // 2. Commit to Git (DISABLED FOR EDGE RUNTIME)
    /*
    try {
      const git = simpleGit();
      // ... logic commented out ...
      console.log('Skipping Git Commit on Edge');
    } catch (e) {
      console.error('❌ Publisher Agent: Git/File error', e);
    }
    */

    // 3. Webhook Notification
    this.sendNotification(post.analysis.toolName, post.analysis.smartScore?.total || 0, post.analysis.criticalFlaws);
  }

  private sendNotification(name: string, score: number, cons: string[]) {
    // Mock Webhook
    console.log(`🔔 Webhook Sent: "New Honest Review: ${name} | Score: ${score}/10 | Cons: ${cons.length}"`);
  }
}
