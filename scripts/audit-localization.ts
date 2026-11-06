/**
 * Localization audit — flags untranslated UI strings on Korean pages
 * (and Korean UI strings on English pages).
 *
 * Usage:
 *   npx ts-node --project tsconfig.json scripts/audit-localization.ts [--base https://www.smartworklab.store]
 *
 * How it works: fetches each public route in both locales, strips
 * <script>/<style> (so the React Server Components payload is ignored)
 * and tags, then looks for a curated list of UI phrases. This is a
 * heuristic check, not a translation judge:
 * - Article bodies legitimately contain English technical terms and
 *   code, so the flag list is UI chrome only (headings, buttons, nav,
 *   labels, dates). A match inside article prose still needs a human
 *   to confirm — the report prints the surrounding context.
 * - Brand names, code identifiers, URLs, numbers, and the copyright
 *   line are allowlisted and never flagged.
 *
 * Exit code is 1 when any page fails, so it can run in CI.
 */

const BASE = process.argv.includes('--base')
  ? process.argv[process.argv.indexOf('--base') + 1]
  : 'https://www.smartworklab.store';

const ROUTES = [
  '/',
 '/lab', '/lab/series', '/lab/series/mochi-sprout',
  '/lab/mochi-sprout-day01-first-mujoco-simulation',
  '/lab/mochi-sprout-day02-feedback-control',
  '/projects', '/services', '/about', '/privacy', '/terms',
];

// Known intentional occurrences — never flagged:
// - Legal document H1s carry the English name in parentheses, e.g.
//   "개인정보 처리방침 (Privacy Policy)" and "이용약관 (Terms of Service)".
const IGNORE: Record<string, string[]> = {
  '/ko/privacy': ['Privacy Policy'],
  '/ko/terms': ['Terms of Service'],
};
const EN_UI_PHRASES = [
  'Articles', 'Technical essays', 'Read Deep Dive', 'Previous', 'Next →',
  'Back to The Lab', 'Effective Date', 'Privacy Policy', 'Terms of Service',
  'Sitemap', 'Explore', 'On this page', 'Back to Home', 'Loading articles',
  'Technical articles are being prepared', 'First article in preparation',
  'View series articles', 'All articles in this series', 'min read',
  'Disclosure:', 'Series | SmartWorkLab', 'Articles | SmartWorkLab',
  'Last updated', 'Interactive Demo', 'Copy email address',
];

// Korean UI phrases that must not appear on English pages.
const KO_UI_PHRASES = [
  '아티클', '기술 글', '연재 시리즈', '자세히 읽기', '이전 글', '다음 글',
  '아티클 목록으로', '개인정보 처리방침', '이용약관', '사이트맵', '둘러보기',
  '이 페이지에서', '홈으로', '최종 수정일', '분 읽기', '아티클을 불러오는 중',
];

function visibleText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ');
}

function context(text: string, phrase: string): string {
  const i = text.indexOf(phrase);
  if (i < 0) return '';
  return text.slice(Math.max(0, i - 40), i + phrase.length + 40).trim();
}

async function check(route: string, locale: 'en' | 'ko'): Promise<string[]> {
  const url = `${BASE}/${locale}${route === '/' ? '' : route}`;
  const res = await fetch(url);
  if (!res.ok) return [`HTTP ${res.status} — page did not load`];
  const text = visibleText(await res.text());
  const phrases = locale === 'ko' ? EN_UI_PHRASES : KO_UI_PHRASES;
  const ignored = IGNORE[`/${locale}${route === '/' ? '' : route}`] ?? [];
  const hits: string[] = [];
  for (const phrase of phrases) {
    if (ignored.includes(phrase)) continue;
    if (text.includes(phrase)) {
      hits.push(`"${phrase}" — …${context(text, phrase)}…`);
    }
  }
  return hits;
}

async function main() {
  console.log(`🌐 Localization audit — base: ${BASE}`);
  let failures = 0;
  for (const route of ROUTES) {
    for (const locale of ['en', 'ko'] as const) {
      const hits = await check(route, locale);
      const label = `/${locale}${route === '/' ? '' : route}`;
      if (hits.length === 0) {
        console.log(`✅ ${label}`);
      } else {
        failures += 1;
        console.log(`❌ ${label} (${hits.length} hit${hits.length > 1 ? 's' : ''})`);
        for (const h of hits) console.log(`     ${h}`);
      }
    }
  }
  console.log(failures === 0 ? '✨ All routes clean.' : `⚠️ ${failures} page(s) with untranslated UI strings.`);
  process.exit(failures === 0 ? 0 : 1);
}

main();
