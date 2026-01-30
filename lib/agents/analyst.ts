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

  generateVerificationSummary: (toolName: string) => {
    // In a real app, this would analyze user_tool_usage data for specific tool patterns
    // For now, we return a deterministic mock based on the tool name
    const confidenceScore = 90 + (toolName.length % 10); // Pseudo-random 90-99

    return {
      toolName,
      confidenceScore,
      verificationStatus: 'Verified',
      marketAnalysis: `Confirmed market dominance in ${toolName.includes('GPT') ? 'LLM' : 'Efficiency'} sector.`,
      accuracyRating: 98.5,
      lastAudited: new Date().toLocaleDateString()
    };
  }
};
