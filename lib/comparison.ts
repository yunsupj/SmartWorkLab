
import { supabase } from '@/lib/supabase';

export interface ComparisonData {
  toolA: ToolWithReview;
  toolB: ToolWithReview;
  verdict: ComparisonVerdict;
}

export interface ToolWithReview {
  id: string;
  name: string;
  category: string;
  price_model: string;
  website_url: string;
  affiliate_link?: string;
  review: {
    smart_score: { roi: number; privacy: number; integration: number; total: number };
    pros: string[];
    cons: string[];
    critical_flaws: string[];
    summary: string;
  };
}

export interface ComparisonVerdict {
  winner: string; // Name of winner or 'Tie'
  reason: string;
  scoreDiff: number;
  categoryWinners: {
    roi: string;
    privacy: string;
    integration: string;
  }
}

export async function getComparisonData(slug: string, locale: string): Promise<ComparisonData | null> {
  const [slugA, slugB] = slug.split('-vs-');
  if (!slugA || !slugB) return null;

  // Normalized search (assuming slug matches name lowercase roughly, or we fetch all and filter)
  // Ideally, we'd have a slug field in DB. For now, name matching is risky but we'll try loose match
  // Or better, we define the valid pairs in a config.
  // Let's try flexible search by name.

  if (!supabase) return null;

  const { data: tools } = await supabase
    .from('products')
    .select('*, reviews!inner(*)')
    .eq('reviews.locale', locale)
    .in('name', [getNameFromSlug(slugA), getNameFromSlug(slugB)]);

  if (!tools || tools.length < 2) return null;

  const toolA = transformTool(tools.find(t => normalize(t.name) === slugA));
  const toolB = transformTool(tools.find(t => normalize(t.name) === slugB));

  if (!toolA || !toolB) return null;

  const verdict = calculateVerdict(toolA, toolB);

  return { toolA, toolB, verdict };
}

// Helper to calculate winner
function calculateVerdict(a: ToolWithReview, b: ToolWithReview): ComparisonVerdict {
  const scoreA = a.review.smart_score;
  const scoreB = b.review.smart_score;

  const totalDiff = scoreA.total - scoreB.total;
  let winner = 'Tie';
  let reason = 'Both tools offer similar value profiles.';

  if (totalDiff > 0.5) {
    winner = a.name;
    reason = `${a.name} outperforms ${b.name} with a higher overall Smart Score (${scoreA.total} vs ${scoreB.total}), particularly in ${getStrongestCategory(scoreA, scoreB)}.`;
  } else if (totalDiff < -0.5) {
    winner = b.name;
    reason = `${b.name} leads with a superior Smart Score (${scoreB.total} vs ${scoreA.total}), excelling in ${getStrongestCategory(scoreB, scoreA)}.`;
  }

  return {
    winner,
    reason,
    scoreDiff: parseFloat(totalDiff.toFixed(1)),
    categoryWinners: {
      roi: scoreA.roi >= scoreB.roi ? a.name : b.name,
      privacy: scoreA.privacy >= scoreB.privacy ? a.name : b.name,
      integration: scoreA.integration >= scoreB.integration ? a.name : b.name,
    }
  };
}

function getStrongestCategory(winnerScore: any, loserScore: any) {
  const roiDiff = winnerScore.roi - loserScore.roi;
  const privDiff = winnerScore.privacy - loserScore.privacy;
  const intDiff = winnerScore.integration - loserScore.integration;

  if (roiDiff >= privDiff && roiDiff >= intDiff) return "ROI";
  if (privDiff >= roiDiff && privDiff >= intDiff) return "Privacy";
  return "Integration";
}

// Utilities for fuzzy matching (quick prototype solution)
function normalize(str: string) {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

// Reverse mapping for common tools (In production, use a 'slug' column in DB)
function getNameFromSlug(slug: string) {
  const map: Record<string, string> = {
    'cursor': 'Cursor',
    'github-copilot': 'GitHub Copilot',
    'claude-3-5-sonnet': 'Claude 3.5 Sonnet',
    'chatgpt-gpt-4o': 'ChatGPT (GPT-4o)',
    'midjourney': 'Midjourney',
    'dall-e-3': 'DALL·E 3',
    'perplexity': 'Perplexity AI',
    'google-gemini': 'Gemini 1.5 Pro', // Mapped seed name
    'jasper': 'Jasper',
    'copy-ai': 'Copy.ai',
    'notion-ai': 'Notion AI',
    'clickup': 'ClickUp Brain'
    // Add others as needed
  };
  return map[slug] || slug; // Fallback
}

function transformTool(raw: any): ToolWithReview | undefined {
  if (!raw) return undefined;
  return {
    id: raw.id,
    name: raw.name,
    category: raw.category,
    price_model: raw.price_model,
    website_url: raw.website_url,
    affiliate_link: raw.affiliate_link,
    review: raw.reviews[0] // Assumes 'inner' join filtered by locale gave us 1 review
  };
}
