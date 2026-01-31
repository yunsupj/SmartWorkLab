'use server';

import { Scout } from '@/lib/agents/scout';

export async function analyzeToolAction(input: string) {
  // Debug: Check Key Availability
  const hasKey = !!process.env.OPENAI_API_KEY || !!process.env.GEMINI_API_KEY;
  console.log(`[ServerAction] Analyzing input. API Key Present: ${hasKey}`);

  if (!hasKey) {
    console.error("[ServerAction] Missing API Key. AI Analysis will likely fail or use mock.");
  }

  try {
    const results = await Scout.analyzeRawInput(input);
    return { success: true, data: results };
  } catch (error) {
    console.error("[ServerAction] Analysis Failed:", error);
    return { success: false, error: 'Failed to analyze text' };
  }
}
