import { RawToolData, AnalysisResult, SmartScore } from './types';

export class AnalystAgent {
  async analyze(tool: RawToolData): Promise<AnalysisResult> {
    console.log(`🧠 Analyst Agent: Analyzing ${tool.name}...`);

    // In a real scenario, this would call an LLM (e.g., GPT-4) with prompt engineering
    // to extract pros/cons from comments and generate scoring.
    // For this prototype, we will simulate the logic.

    // 1. Logic Gate: Check for cons
    // Simulating extraction from comments
    const extractedCons = [
      "Export feature is buggy",
      "Expensive compared to competitors",
      "Vague data privacy"
    ];

    const extractedPros = [
      "Intuitive UI",
      "Great Slack integration",
      "Combines multiple models"
    ];

    // Strict Logic Gate: Must have at least 2 cons
    if (extractedCons.length < 2) {
      console.log(`❌ Analyst Agent: Rejected ${tool.name} - Insufficient 'Honest' Data (Cons < 2)`);
      return {
        toolName: tool.name,
        isApproved: false,
        rejectionReason: "Insufficient critical data found to form an honest review.",
        criticalFlaws: [],
        pros: [],
        cons: [],
        competitors: [],
        category: "Unknown",
        summary: ""
      };
    }

    // 2. Scoring
    const score: SmartScore = {
      roi: 7,         // Expensive but useful
      privacy: 5,     // Vague policy
      integration: 9, // Slack is great
      total: 7.0
    };

    // 3. Competitor Analysis
    const competitors = [
      { name: "Notion AI", visualComparison: "Notion is cheaper ($10) but less flexible." },
      { name: "Jasper", visualComparison: "Jasper has better templates but worse UI." }
    ];

    console.log(`✅ Analyst Agent: Approved ${tool.name} with Smart Score ${score.total}`);

    return {
      toolName: tool.name,
      isApproved: true,
      smartScore: score,
      criticalFlaws: ["Vague data privacy policy", "Export bugs"],
      pros: extractedPros,
      cons: extractedCons,
      competitors: competitors,
      category: "Productivity",
      summary: tool.description
    };
  }
}
