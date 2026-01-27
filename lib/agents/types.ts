export interface RawToolData {
  name: string;
  websiteUrl: string;
  tagline: string;
  description: string;
  source: 'ProductHunt' | 'Reddit' | 'Twitter';
  sourceUrl: string;
  pricing?: string;
  userComments: string[]; // For sentiment analysis
}

export interface SmartScore {
  roi: number;        // 1-10
  privacy: number;    // 1-10
  integration: number;// 1-10
  total: number;      // Average
}

export interface AnalysisResult {
  toolName: string;
  isApproved: boolean;
  rejectionReason?: string;
  smartScore?: SmartScore;
  criticalFlaws: string[];
  pros: string[];
  cons: string[];
  competitors: Array<{ name: string; visualComparison: string }>; // Simple comparison text
  category: string;
  summary: string;
}

export interface ContentDraft {
  locale: 'en' | 'ko' | 'de';
  title: string;
  body: string; // Markdown
  summary: string;
}

export interface FinalPost {
  analysis: AnalysisResult;
  drafts: Record<string, ContentDraft>;
  toolData: RawToolData;
}
