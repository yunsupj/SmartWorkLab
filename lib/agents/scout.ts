export type TaskCategory = 'Copywriting' | 'Coding' | 'Design' | 'Research' | 'SEO';

export const MARKET_RATES: Record<TaskCategory, number> = {
  Copywriting: 50, // per hour
  Coding: 120,     // per hour
  Design: 80,      // per hour
  Research: 40,    // per hour
  SEO: 70,         // per hour
};

export const Scout = {
  fetchMarketRates: async () => {
    // In a real scenario, this could fetch from an external API or DB
    // For now, we return our benchmark constants
    return MARKET_RATES;
  },

  getRateForCategory: (category: string): number => {
    return MARKET_RATES[category as TaskCategory] || 40; // Default fallback
  },

  // Mock Analysis for "Track A"
  analyzeEmailSubscriptions: async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Return mock detected tools
    return [
      { toolName: 'Midjourney Standard', monthlyCost: 30, hoursSaved: 12, taskCategory: 'Design' },
      { toolName: 'GitHub Copilot', monthlyCost: 10, hoursSaved: 20, taskCategory: 'Coding' },
    ];
  }
};
