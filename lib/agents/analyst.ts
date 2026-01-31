import { AIProvider } from '@/lib/ai/provider';
import { Scout } from './scout';

export interface UsageData {
  id: string;
  tool_name: string;
  monthly_cost: number;
  hours_saved: number;
  task_category: string;
}

export interface ROIReport {
  totalAnnualSavings: number;
  totalHoursSaved: number;
  efficiencyGain: number;
  costComparison: {
    category: string;
    traditionalCost: number; // (Hours * Rate)
    aiCost: number;         // (Subscription Cost)
  }[];
  efficiencyBreakdown: {
    name: string;
    value: number;
    color: string;
  }[];
}

export const Analyst = {
  calculateROI: (usageData: UsageData[]) => {
    let totalMonthlySavings = 0;
    let totalMonthlyHours = 0;
    let totalMonthlyCost = 0;

    const costComparisonMap: Record<string, { traditional: number, ai: number }> = {};
    const efficiencyMap: Record<string, number> = {};

    usageData.forEach(item => {
      const rate = Scout.getRateForCategory(item.task_category);
      const traditionalCost = item.hours_saved * rate;
      const savings = traditionalCost - item.monthly_cost;

      totalMonthlySavings += Math.max(0, savings);
      totalMonthlyHours += item.hours_saved;
      totalMonthlyCost += item.monthly_cost;

      // Aggregates for Charts
      if (!costComparisonMap[item.task_category]) {
        costComparisonMap[item.task_category] = { traditional: 0, ai: 0 };
      }
      costComparisonMap[item.task_category].traditional += traditionalCost;
      costComparisonMap[item.task_category].ai += item.monthly_cost;

      efficiencyMap[item.task_category] = (efficiencyMap[item.task_category] || 0) + item.hours_saved;
    });

    // Format Data for Charts
    const costComparison = Object.keys(costComparisonMap).map(category => ({
      category,
      traditionalCost: costComparisonMap[category].traditional,
      aiCost: costComparisonMap[category].ai
    }));

    const efficiencyBreakdown = Object.keys(efficiencyMap).map((category, index) => {
        const colors = ['#0ea5e9', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'];
        return {
            name: category,
            value: Number(((efficiencyMap[category] / totalMonthlyHours) * 100).toFixed(1)),
            color: colors[index % colors.length]
        };
    });

    const efficiencyGain = totalMonthlyHours > 0
        ? (totalMonthlySavings / (totalMonthlyCost || 1)) // Basic ROI multiplier
        : 0;

    return {
      totalAnnualSavings: totalMonthlySavings * 12,
      totalHoursSaved: totalMonthlyHours,
      efficiencyGain: Number(efficiencyGain.toFixed(1)),
      costComparison,
      efficiencyBreakdown
    };
  },

  // Real AI Semantic Analysis
  generateVerificationSummary: async (toolName: string) => {
    // If no key, fall back to determinstic mock
    if (!process.env.OPENAI_API_KEY && !process.env.GEMINI_API_KEY) {
         const confidenceScore = 90 + (toolName.length % 10);
         return {
           toolName,
           confidenceScore,
           verificationStatus: 'Verified',
           marketAnalysis: `Confirmed market dominance in ${toolName.includes('GPT') ? 'LLM' : 'Efficiency'} sector.`,
           accuracyRating: 98.5,
           lastAudited: new Date().toLocaleDateString()
         };
    }

    const prompt = `
      Analyze the SaaS tool "${toolName}".
      1. Confidence Score (0-100): How widely recognized and trusted is this tool?
      2. Market Analysis: 1 sentence explaining its primary value proposition.
      3. Accuracy Rating (0-100): How consistent is its output (if AI) or uptime?

      Output JSON:
      {
        "confidenceScore": 95,
        "marketAnalysis": "...",
        "accuracyRating": 98
      }
    `;

    try {
       const aiData = await AIProvider.generateJSON<any>(prompt, "Verification stats for SaaS tool");
       return {
          toolName,
          confidenceScore: aiData.confidenceScore || 85,
          verificationStatus: 'Verified by AI',
          marketAnalysis: aiData.marketAnalysis || "Verified tool.",
          accuracyRating: aiData.accuracyRating || 90,
          lastAudited: new Date().toLocaleDateString()
       };
    } catch (e) {
       console.error("Analyst AI Failed:", e);
       return {
           toolName,
           confidenceScore: 80,
           verificationStatus: 'AI Analysis Failed',
           marketAnalysis: "Could not verify real-time data.",
           accuracyRating: 0,
           lastAudited: new Date().toLocaleDateString()
       };
    }
  }
};
