import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import * as dotenv from 'dotenv';

// .env 파일의 환경 변수를 로드합니다.
dotenv.config({ path: '.env.local' });
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // 주의: ANON_KEY가 아닌 SERVICE_ROLE_KEY를 써야 UPDATE 권한이 생깁니다.

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

  const files = fs.readdirSync(contentDir).filter(file => file.endsWith('.mdx'));

  console.log(`🚀 ${files.length}개의 포스팅 동기화를 시작합니다...`);

  for (const file of files) {
    const filePath = path.join(contentDir, file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');

    // MDX 파일 상단의 --- 사이의 메타데이터를 파싱합니다.
    const { data: frontmatter, content } = matter(fileContent);
    const slug = file.replace('.mdx', '');

    const postData = {
      slug: slug,
      locale: frontmatter.locale || 'en',
      title: frontmatter.title,
      subtitle: frontmatter.subtitle || null,
      excerpt: frontmatter.excerpt || null,
      body_mdx: content, // 마크다운 본문
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

    const { error } = await supabase
      .from('tech_posts')
      .upsert(postData, { onConflict: 'slug' }); // slug가 겹치면 업데이트, 없으면 삽입

    if (error) {
      console.error(`❌ Sync Failed [${file}]:`, error.message);
    } else {
      console.log(`✅ Synced: ${slug}`);
    }
  }

  console.log('✨ 동기화가 완료되었습니다!');
}

syncLabPosts();