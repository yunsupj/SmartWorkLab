import { Scout } from '@/lib/agents/scout';
import { Analyst } from '@/lib/agents/analyst';
import { WriterAgent } from '@/lib/agents/writer';
import { PublisherAgent } from '@/lib/agents/publisher';
import { RawToolData } from '@/lib/agents/types';

// Mock Tool Data for "Dry Run"
const MOCK_TOOL: RawToolData = {
  name: "ChatGPT Canvas",
  websiteUrl: "https://openai.com/chatgpt",
  tagline: "A new interface for writing and coding",
  description: "ChatGPT Canvas offers a separate workspace for writing and coding projects with inline editing capabilities.",
  source: 'ProductHunt',
  sourceUrl: "https://producthunt.com/posts/chatgpt-canvas",
  pricing: "$20/mo (Plus)",
  userComments: [
    "It's great for coding but the writing features are basic.",
    "Still hallucinates on complex coding tasks."
  ]
};

async function runDryRun() {
  console.log("🚀 Starting Phase 2 Workflow Dry Run: ChatGPT Canvas");

  // 1. Scout
  console.log(`\n--- 1. Scout Agent ---`);
  // @ts-ignore
  const tools = await Scout.findTrendingTools();
  console.log(`Checking trending tools... [MOCKED] Found: ${tools[0]?.name || MOCK_TOOL.name}`);

  // 2. Analyst
  console.log(`\n--- 2. Analyst Agent (The Critic) ---`);
  const verification = await Analyst.generateVerificationSummary(MOCK_TOOL.name);

  const analysisStub = {
      toolName: MOCK_TOOL.name,
      isApproved: true,
      smartScore: { roi: 9, privacy: 8, integration: 9, total: 8.7 },
      criticalFlaws: ["None detected"],
      pros: ["High efficiency"],
      cons: ["Cost"],
      competitors: [],
      category: "General",
      summary: verification.marketAnalysis || "Summary",
      rejectionReason: undefined
  };

  console.log(`STATUS: ${analysisStub.isApproved ? 'APPROVED' : 'REJECTED'}`);

  // 3. Writer
  console.log(`\n--- 3. Writer Agent (Multilingual) ---`);
  const writer = new WriterAgent();
  // @ts-ignore
  const drafts = await writer.generateContent(MOCK_TOOL, analysisStub);

  console.log(`Generated EN Title: "${drafts.en.title}"`);
  console.log(`Generated KO Title: "${drafts.ko.title}"`);

  // 4. Publisher
  console.log(`\n--- 4. Publisher Agent ---`);
  const publisher = new PublisherAgent();
  console.log("Simulating Publish...");

  // Create a mock FinalPost to satisfy the publisher
  const finalPost = {
      analysis: analysisStub,
      drafts: drafts,
      toolData: MOCK_TOOL
  };

  // We won't actually push to git/db in dry run to avoid clutter,
  // just verify instantiation works
  console.log(" - Publisher instantiated successfully");

  console.log("\n✅ Dry Run Complete.");
}

runDryRun().catch(console.error);
