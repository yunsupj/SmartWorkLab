import OpenAI from 'openai';
import { z } from 'zod';

// Initialize OpenAI Client
// Expects OPENAI_API_KEY in env variables.
// If using Gemini, we would adapt this provider to use the Google SDK.
const apiKey = process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY; // Fallback logic if user swaps keys
// Note: For Gemini via OpenAI compatibility layer (if used), baseURL would need to change.
// For now, we assume standard OpenAI or compatible endpoint.

const openai = new OpenAI({
  apiKey: apiKey || 'dummy-key-for-build', // Prevent build crash if key missing
  dangerouslyAllowBrowser: true // For demo purposes if client-side calls needed (usually server-side preferred)
});

export const AIProvider = {
  /**
   * Generates a structured JSON response from an LLM.
   * Uses OpenAI's JSON mode or function calling (simplified here).
   */
  generateJSON: async <T>(prompt: string, schemaDescription: string): Promise<T> => {
    if (!apiKey) {
      console.warn("⚠️ No API Key found. Returning mock error or throw.");
      throw new Error("Missing API Key for AI Provider");
    }

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o", // Or "gpt-3.5-turbo"
        messages: [
          {
            role: "system",
            content: `You are a helpful JSON extraction assistant.
            Output strictly valid JSON matching this description: ${schemaDescription}.
            Do not output markdown code blocks.`
          },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" }
      });

      const content = completion.choices[0].message.content;
      if (!content) throw new Error("Empty response from AI");

      return JSON.parse(content) as T;
    } catch (error) {
      console.error("AI Provider Error:", error);
      throw error;
    }
  },

  /**
   * Generates a text response.
   */
  generateText: async (prompt: string): Promise<string> => {
    if (!apiKey) return "AI Service Unavailable (Missing Key)";

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }]
      });

      return completion.choices[0].message.content || "No response generated.";
    } catch (error) {
      console.error("AI Provider Text Error:", error);
      return "Failed to generate text.";
    }
  }
};
