import { AIProvider } from '@/lib/ai/provider';

export type TaskCategory = 'Copywriting' | 'Coding' | 'Design' | 'Research' | 'SEO';

export const MARKET_RATES: Record<TaskCategory, number> = {
  Copywriting: 50, // per hour
  Coding: 120,     // per hour
  Design: 80,      // per hour
  Research: 40,    // per hour
  SEO: 70,         // per hour
};

interface ToolDetection {
    toolName: string;
    monthlyCost: number;
    hoursSaved: number;
    taskCategory: TaskCategory;
}

export const Scout = {
  fetchMarketRates: async () => {
    // In a real scenario, this could fetch from an external API or DB
    // For now, we return our benchmark constants
    return MARKET_RATES;
  },

  getRateForCategory: (category: string): number => {
    return MARKET_RATES[category as TaskCategory] || 40; // Default fallback
  },

  // Real AI Analysis for "Track A"
  // Input: Raw text (e.g. pasted subscriptions or email snippet)
  analyzeRawInput: async (inputText: string): Promise<ToolDetection[]> => {
    console.log("[Scout] Analyzing Input:", inputText);

    // 1. Validation
    if (!inputText || inputText.length < 3) {
        console.warn("[Scout] Input too short");
        return [];
    }

    const prompt = `
      You are an expert SaaS Cost Analyst.
      Task: Parse the following text to extract software subscription data.

      Input Text: "${inputText}"

      Output Requirements:
      - Return ONLY a valid JSON object.
      - Structure: { "tools": [ { "toolName": string, "monthlyCost": number, "hoursSaved": number, "taskCategory": "Coding" | "Copywriting" | "Design" | "Research" | "SEO" } ] }
      - If cost is annual, divide by 12.
      - If cost is missing, estimate based on standard market rates (e.g. Netflix ~15, ChatGPT ~20).
      - Category MUST be one of the 5 allowed types. default to "General" (mapped to Research) if unsure.

      Inference Rules for "Hours Saved":
      1. Detect usage intensity keywords:
         - "Heavy", "All day", "Primary tool" -> 30-40 hours/mo.
         - "Daily", "Regular" -> 15-20 hours/mo.
         - "Occasional", "Sometimes" -> 5-10 hours/mo.
      2. Apply Category Multiplier (if intensity is unspecified, use these baselines):
         - Coding (e.g. Copilot, Cursor) -> Base 20h.
         - Design/Video (e.g. Midjourney) -> Base 15h.
         - Writing/SEO -> Base 10h.

      JSON:
    `;

    try {
       // 2. Call AI
       const result = await AIProvider.generateJSON<{ tools: ToolDetection[] }>(prompt, "List of detected tools");

       console.log("[Scout] Raw AI Response:", result);

       if (!result || !result.tools || result.tools.length === 0) {
           throw new Error("Empty AI Result");
       }

       return result.tools;
    } catch (e) {
       console.error("[Scout] AI Failed, attempting Fallback:", e);

       // 3. Fallback Parser (Regex heuristic)
       // meaningful if input is simple like "Claude $20"
       const fallbackTools: ToolDetection[] = [];
       const costMatch = inputText.match(/\$(\d+)/);
       const cost = costMatch ? parseInt(costMatch[1]) : 0;

       // Simple heuristic for name
       const name = inputText.split(' ')[0] || "Unknown Tool";

       if (name.length > 2) {
           fallbackTools.push({
               toolName: name,
               monthlyCost: cost,
               hoursSaved: 5, // conservative estimate
               taskCategory: 'Research' // safe default
           });
       }

       if (fallbackTools.length > 0) {
           console.log("[Scout] Fallback successful:", fallbackTools);
           return fallbackTools;
       }

       // Final Fail
       return [
         { toolName: 'AI Detection Failed', monthlyCost: 0, hoursSaved: 0, taskCategory: 'Research' }
       ];
    }
  },

  // Mock Analysis (Legacy Support)
  analyzeEmailSubscriptions: async () => {
    // Deprecated but kept for backward compatibility if needed
    return Scout.analyzeRawInput("I use Midjourney for design ($30) and Github Copilot for coding ($10)");
  },

  // Mock Trending Tools for Pipeline
  findTrendingTools: async () => {
      // Simulate fetch
      return [
          {
              name: 'Cursor AI',
              websiteUrl: 'https://cursor.sh',
              tagline: 'The AI Code Editor',
              description: 'An IDE that writes code for you.',
              source: 'ProductHunt',
              sourceUrl: 'https://producthunt.com',
              userComments: ['Amazing', 'Fast'],
              pricing: '$20/mo'
          }
      ];
  }
};
