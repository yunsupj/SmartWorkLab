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
      const { error } = await supabaseAdmin
        .from('reviews')
        .upsert({
          tool_id: undefined, // Ideally we resolve this or insert into tools table first.
          // For MVP we might need a tools insert here or assume it's done.
          // Let's assume we insert into 'tools' first then 'reviews'.
          // SKIPPING ACTUAL DB CALL for safety if mocked, but showing logic:
          status: 'pending_review',
          smart_score: post.analysis.smartScore,
          critical_flaws: post.analysis.criticalFlaws,
          competitors: post.analysis.competitors
        });

      if (error) console.error('Supabase Error:', error);
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
