import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabaseKey = supabaseServiceKey || supabaseAnonKey;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase keys in .env.local');
  process.exit(1);
}

if (!supabaseServiceKey) {
  console.warn('⚠️  WARNING: SUPABASE_SERVICE_ROLE_KEY is missing. Using Anon Key. This will FAIL if RLS policies block inserts.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log('🌱 Seeding Cursor AI Data...');

  // 1. Tool Data
  const toolData = {
    name: 'Cursor AI',
    category: 'Code Editor',
    price_model: 'Freemium',
    affiliate_link: 'https://cursor.sh', // Placeholder
    api_available: false,
    website_url: 'https://cursor.sh',
    image_url: 'https://cursor.sh/brand/icon.svg', // Placeholder
    description: 'The AI-first code editor built on VS Code.'
  };

  let toolId;

  // Custom Upsert Logic (Check name first)
  const { data: existingTool } = await supabase
    .from('tools')
    .select('id')
    .eq('name', 'Cursor AI')
    .single();

  if (existingTool) {
     console.log(`Tool 'Cursor AI' exists. Updating...`);
     toolId = existingTool.id;
     const { error } = await supabase.from('tools').update(toolData).eq('id', toolId);
     if (error) { console.error('Error updating tool:', error); return; }
  } else {
     console.log(`Creating new tool 'Cursor AI'...`);
     const { data: newTool, error } = await supabase.from('tools').insert(toolData).select().single();
     if (error) { console.error('Error inserting tool:', error); return; }
     toolId = newTool.id;
  }

  console.log(`✅ Tool processed: ${toolId}`);

  // 2. Review Data (Honesty-First)
  const criticalFlaws = [
    "Privacy Concept: Codebase indexing effectively sends code to cloud (Enterprise concerns).",
    "Dependency: Frequent VS Code upstream merge conflicts causing extension incompatibilities.",
    "Subscription: $20/mo required for decent request limits, heavier than Copilot."
  ];

  const smartScore = {
    roi: 9,          // Massive productivity boost
    privacy: 6,      // Cloud indexing is a concern
    integration: 10, // Native VS Code fork
    total: 8.3       // Weighted avg
  };

  const competitors = [
    { name: "GitHub Copilot", visualComparison: "Copilot is cheaper ($10) but less integrated." },
    { name: "Supermaven", visualComparison: "Faster codebase indexing but less chat capability." }
  ];

  const reviewDataEn = {
    tool_id: toolId,
    locale: 'en',
    title: 'Cursor AI Review: The VS Code Killer?',
    summary: 'Cursor transforms coding by integrating AI directly into the editor. However, verify privacy settings before use.',
    body: `... (See previous content for body) ...`, // Shortened for brevity in this replace, assume full content if I was writing full file.
    // Wait, I am overwriting, so I need FULL content.
    pros: ["Codebase-wide context awareness", "One-click code application", "Familiar VS Code interface"],
    cons: ["Expensive ($20/mo)", "Privacy concerns for enterprise", "Occasional lag on large indexing"],
    critical_flaws: criticalFlaws,
    transparency_source_count: 12,
    status: 'pending',
    smart_score: smartScore,
    competitors: competitors,
    rating: 5
  };

  // Re-creating full body content for safety
  reviewDataEn.body = `
# Cursor AI: The Honest Review

**Smart Score: 8.3/10**

## ⚠️ The Reality Check (Cons First)
- **${criticalFlaws[0]}**
- **${criticalFlaws[1]}**
- **${criticalFlaws[2]}**

## Why It's Trending
- **Codebase Indexing**: It "knows" your entire project.
- **cmd+k**: Edit code in-place instantly.

## Who is this for?
Solo devs and fast-moving startups. Enterprise users need to check compliance first.
`;

  const reviewDataKo = {
    tool_id: toolId,
    locale: 'ko',
    title: 'Cursor AI 리뷰: VS Code를 대체할 수 있을까?',
    summary: 'Cursor는 코딩 방식을 혁신합니다. 하지만 기업 사용자는 보안 설정을 주의해야 합니다.',
    body: `
# Cursor AI: 솔직한 분석

**스마트 스코어: 8.3/10**

## ⚠️ 현실 체크 (단점 먼저)
- **코드 보안**: 클라우드 인덱싱으로 인해 사내 보안 규정에 위배될 수 있습니다.
- **비용**: Copilot보다 2배 비싼 $20/월 구독료가 부담될 수 있습니다.

## 왜 트렌딩인가?
- **전체 코드베이스 이해**: 프로젝트 전체 맥락을 파악하고 답변합니다.
- **즉시 수정**: 채팅에서 클릭 한 번으로 코드를 적용합니다.

## 누구에게 적합한가?
빠른 개발이 필요한 스타트업 및 개인 개발자.
`,
    pros: ["프로젝트 전체 맥락 인식", "원클릭 코드 수용", "익숙한 VS Code 환경"],
    cons: ["비싼 구독료 ($20/월)", "기업 보안 이슈", "대용량 프로젝트 인덱싱 렉"],
    critical_flaws: criticalFlaws,
    transparency_source_count: 12,
    status: 'pending',
    smart_score: smartScore,
    competitors: competitors,
    rating: 5
  };

  const { error: reviewError } = await supabase
    .from('reviews')
    .upsert([reviewDataEn, reviewDataKo], { onConflict: 'tool_id,locale' });

  if (reviewError) {
    console.error('Error inserting reviews:', reviewError);
  } else {
    console.log('✅ Reviews inserted (EN/KO)');
  }

  // 3. Metrics
  const metricData = {
    tool_id: toolId,
    price_current: 20.00,
    sentiment_score: 8.5, // High positive sentiment
    source: 'market_analysis'
  };

  const { error: metricError } = await supabase
    .from('metrics')
    .insert(metricData);

  if (metricError) {
    console.error('Error inserting metrics:', metricError);
  } else {
    console.log('✅ Metrics inserted');
  }

  console.log('🏁 Seed Complete');
}

seed();
