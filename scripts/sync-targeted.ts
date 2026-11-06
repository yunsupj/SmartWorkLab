import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import * as dotenv from 'dotenv';

/**
 * Targeted Lab sync — upserts ONLY the MDX files named on the command line.
 *
 * Usage:
 *   npx ts-node --project tsconfig.json scripts/sync-targeted.ts <file...> [--dry-run]
 *
 * Example (publish Day 1 + Day 2, in publication order):
 *   npx ts-node --project tsconfig.json scripts/sync-targeted.ts \
 *     content/lab/en/mochi-sprout-day01-first-mujoco-simulation.mdx \
 *     content/lab/ko/mochi-sprout-day01-first-mujoco-simulation.mdx \
 *     content/lab/en/mochi-sprout-day02-feedback-control.mdx \
 *     content/lab/ko/mochi-sprout-day02-feedback-control.mdx
 *
 * Why this exists: scripts/sync-lab.ts syncs EVERYTHING under content/lab.
 * Several old files have no is_published flag, so a full sync would publish
 * them (default true). Never run the full sync to publish new articles —
 * always name the files here. Files are processed in argument order, so list
 * earlier articles first to keep published_at ordering correct.
 *
 * --dry-run parses the files and prints what would be upserted without
 * touching the database (and without needing Supabase env vars).
 */

dotenv.config({ path: '.env.local' });
dotenv.config();

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const files = args.filter((a) => a !== '--dry-run');

if (files.length === 0) {
  console.error('❌ Error: no files given. Pass MDX file paths, e.g.:');
  console.error('   npx ts-node --project tsconfig.json scripts/sync-targeted.ts content/lab/en/<slug>.mdx');
  process.exit(1);
}

for (const f of files) {
  const resolved = path.resolve(f);
  if (!resolved.startsWith(path.join(process.cwd(), 'content', 'lab') + path.sep)) {
    console.error(`❌ Error: ${f} is outside content/lab — refusing.`);
    process.exit(1);
  }
  if (!f.endsWith('.mdx') || !fs.existsSync(resolved)) {
    console.error(`❌ Error: ${f} is not an existing .mdx file.`);
    process.exit(1);
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!dryRun && (!supabaseUrl || !supabaseServiceKey)) {
  console.error('❌ Error: Supabase 환경 변수가 설정되지 않았습니다. (.env.local 확인)');
  process.exit(1);
}

const supabase = dryRun ? null : createClient(supabaseUrl!, supabaseServiceKey!);

async function main() {
  console.log(
    `${dryRun ? '[DRY RUN] ' : ''}🎯 Targeted sync: ${files.length} file(s) only — nothing else will be touched.`,
  );
  const synced: { slug: string; locale: string }[] = [];

  for (const file of files) {
    const filePath = path.resolve(file);
    const locale = path.basename(path.dirname(filePath));
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data: frontmatter, content } = matter(fileContent);
    const slug = (frontmatter.slug || path.basename(file, '.mdx'))
      .replace(/-ko$/, '')
      .replace(/-en$/, '');

    let existing: { id: string; published_at: string | null } | null = null;
    if (!dryRun) {
      const { data } = await supabase!
        .from('tech_posts')
        .select('id, published_at')
        .eq('slug', slug)
        .eq('locale', locale)
        .single();
      existing = data ?? null;
    }

    // Safe date logic (same as sync-lab.ts): existing DB date wins,
    // then MDX date, then current time. Never overwrites an existing date.
    let finalPublishedAt: string;
    if (existing && existing.published_at) {
      finalPublishedAt = existing.published_at;
    } else if (frontmatter.date) {
      finalPublishedAt = new Date(frontmatter.date).toISOString();
    } else {
      finalPublishedAt = new Date().toISOString();
    }

    const postData: Record<string, unknown> = {
      slug,
      locale,
      title: frontmatter.title,
      subtitle: frontmatter.subtitle || null,
      excerpt: frontmatter.excerpt || null,
      body_mdx: content,
      series: frontmatter.series || null,
      tags: frontmatter.tags || [],
      read_time_min: frontmatter.read_time_min || 5,
      has_code: frontmatter.has_code ?? true,
      has_latex: frontmatter.has_latex ?? false,
      is_published: frontmatter.is_published ?? true,
      author: frontmatter.author || 'SmartWorkLab Engineering',
      published_at: finalPublishedAt,
      cover_image_url: frontmatter.cover_image_url || null,
    };
    if (existing) postData.id = existing.id;

    if (dryRun) {
      console.log(
        `  [dry-run] ${locale}/${slug} — "${frontmatter.title}" ` +
          `(is_published=${postData.is_published}, published_at=${finalPublishedAt}, ` +
          `body=${(content as string).length} chars, existing=${existing ? 'yes' : 'no'})`,
      );
      continue;
    }

    const { error } = await supabase!.from('tech_posts').upsert(postData);
    if (error) {
      console.error(`❌ Sync Failed [${locale}/${slug}]:`, error.message);
      process.exitCode = 1;
    } else {
      synced.push({ slug, locale });
      console.log(
        `✅ Synced: ${locale}/${slug} (published_at=${finalPublishedAt}, ` +
          `is_published=${postData.is_published})`,
      );
    }
  }

  if (!dryRun) {
    const slugs = [...new Set(synced.map((s) => s.slug))];
    const { data } = await supabase!
      .from('tech_posts')
      .select('slug, locale, is_published, published_at')
      .in('slug', slugs)
      .order('published_at', { ascending: true });
    console.log('📋 Current rows for the synced slugs:');
    for (const row of data ?? []) {
      console.log(
        `   ${row.locale}/${row.slug} published=${row.is_published} at=${row.published_at}`,
      );
    }
  }

  console.log('✨ Targeted sync done.');
}

main();
