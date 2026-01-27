import { FinalPost } from './types';
import { supabaseAdmin } from '../supabase';
import simpleGit from 'simple-git';
import fs from 'fs/promises';
import path from 'path';

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
          /*
          tool_id: toolId,
          locale: 'en',
          title: post.drafts.en.title,
          ...
          */
          status: 'pending_review',
          smart_score: post.analysis.smartScore,
          critical_flaws: post.analysis.criticalFlaws,
          competitors: post.analysis.competitors
        });

      if (error) console.error('Supabase Error:', error);
    } else {
      console.log('⚠️ Publisher Agent: Supabase keys missing, skipping DB write.');
    }

    // 2. Commit to Git
    try {
      const git = simpleGit();
      const slug = post.analysis.toolName.toLowerCase().replace(/ /g, '-');
      const date = new Date().toISOString().split('T')[0];
      const filename = `${date}-${slug}.json`;
      const dataDir = path.join(process.cwd(), 'data', 'reviews');

      await fs.mkdir(dataDir, { recursive: true });
      await fs.writeFile(
        path.join(dataDir, filename),
        JSON.stringify(post, null, 2)
      );

      // Check if we are in a git repo before trying to commit
      const isRepo = await git.checkIsRepo();
      if (isRepo) {
        // Need to configure user if not set, usually env vars handle this in CI
        // For local, we assume it's set.
        await git.add(path.join(dataDir, filename));
        await git.commit(`feat(data): Add review for ${post.analysis.toolName}`);
        // await git.push(); // DANGEROUS to auto-push without strict checks, leaving commented for safety
        console.log(`✅ Publisher Agent: Committed ${filename} to Git`);
      } else {
         console.warn('⚠️ Publisher Agent: Not a git repo, skipping commit.');
      }

    } catch (e) {
      console.error('❌ Publisher Agent: Git/File error', e);
    }

    // 3. Webhook Notification
    this.sendNotification(post.analysis.toolName, post.analysis.smartScore?.total || 0, post.analysis.criticalFlaws);
  }

  private sendNotification(name: string, score: number, cons: string[]) {
    // Mock Webhook
    console.log(`🔔 Webhook Sent: "New Honest Review: ${name} | Score: ${score}/10 | Cons: ${cons.length}"`);
  }
}
