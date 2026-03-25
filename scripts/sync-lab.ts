import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Supabase 환경 변수가 설정되지 않았습니다.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function syncLabPosts() {
  const contentDir = path.join(process.cwd(), 'content/lab');

  if (!fs.existsSync(contentDir)) {
    console.error(`❌ Error: '${contentDir}' 폴더가 존재하지 않습니다.`);
    return;
  }

  function getMdxFiles(dir: string, relativePath = ''): { file: string, locale: string, filePath: string }[] {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    let results: { file: string, locale: string, filePath: string }[] = [];
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        results = results.concat(getMdxFiles(fullPath, path.join(relativePath, entry.name)));
      } else if (entry.isFile() && entry.name.endsWith('.mdx')) {
        const locale = relativePath ? relativePath : 'en';
        results.push({ file: entry.name, locale, filePath: fullPath });
      }
    }
    return results;
  }

  const filesToSync = getMdxFiles(contentDir);
  console.log(`🚀 ${filesToSync.length}개의 포스팅 동기화를 시작합니다...`);

  for (const item of filesToSync) {
    const fileContent = fs.readFileSync(item.filePath, 'utf-8');
    const { data: frontmatter, content } = matter(fileContent);
    // Explicitly strip -ko or -de from the filename
    const slug = (frontmatter.slug || item.file.replace('.mdx', '')).replace(/-ko$/, '').replace(/-de$/, '').replace(/-en$/, '');

    const postData: any = {
      slug: slug,
      locale: item.locale,
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
      published_at: frontmatter.published_at || new Date().toISOString(),
      cover_image_url: frontmatter.cover_image_url || null,
    };

    // Safe Upsert pattern: Fetch ID first to avoid unique constraint mismatch
    const { data: existing } = await supabase
      .from('tech_posts')
      .select('id')
      .eq('slug', slug)
      .eq('locale', item.locale)
      .single();

    if (existing) {
      postData.id = existing.id;
    }

    const { error } = await supabase
      .from('tech_posts')
      .upsert(postData);

    if (error) {
      console.error(`❌ Sync Failed [${item.locale}/${slug}]:`, error.message);
    } else {
      console.log(`✅ Synced: ${item.locale}/${slug}`);
    }
  }

  console.log('✨ 동기화가 완료되었습니다!');
}

syncLabPosts();