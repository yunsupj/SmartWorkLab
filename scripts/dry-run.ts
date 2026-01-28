import { ScoutAgent } from '@/lib/agents/scout';
import { AnalystAgent } from '@/lib/agents/analyst';
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
    "Still hallucinates on complex coding tasks.",
    "The UI is cleaner than the standard chat.",
    "Why can't I export to Markdown directly?",
    "Good start but needs more integrations.",
    "Expensive if you just want a text editor."
  ]
};

async function runDryRun() {
  console.log("🚀 Starting Phase 2 Workflow Dry Run: ChatGPT Canvas");

  // 1. Scout (Skipping search, using mock)
  console.log(`\n--- 1. Scout Agent ---`);
  console.log(`Checking trending tools... [MOCKED] Found: ${MOCK_TOOL.name}`);

  // 2. Analyst
  console.log(`\n--- 2. Analyst Agent (The Critic) ---`);
  const analyst = new AnalystAgent();
  const analysis = await analyst.analyze(MOCK_TOOL);

  console.log(`STATUS: ${analysis.isApproved ? 'APPROVED' : 'REJECTED'}`);
  if (!analysis.isApproved) {
    console.log(`REASON: ${analysis.rejectionReason}`);
    return;
  }

  console.log(`SMART SCORE: ${analysis.smartScore?.total}/10`);
  console.log(`CRITICAL FLAWS (Honesty Check):`);
  analysis.criticalFlaws.forEach(f => console.log(`  - ${f}`));
  console.log(`CONS:`);
  analysis.cons.forEach(c => console.log(`  - ${c}`));

  // 3. Writer
  console.log(`\n--- 3. Writer Agent (Multilingual) ---`);
  const writer = new WriterAgent();
  const drafts = await writer.generateContent(MOCK_TOOL, analysis);

  console.log(`Generated EN Title: "${drafts.en.title}"`);
  console.log(`Generated KO Title: "${drafts.ko.title}"`);

  // 4. Publisher
  console.log(`\n--- 4. Publisher Agent ---`);
  const publisher = new PublisherAgent();
  // We won't actually push to git/db in dry run to avoid clutter,
  // or we can mock the publish method logic here.
  console.log("Simulating Publish...");
  console.log(" - DB Upsert: [PENDING REVIEW]");
  console.log(" - Git Verified: Metadata JSON ready");
  console.log(" - Webhook: Triggered");

  console.log("\n✅ Dry Run Complete.");
}

runDryRun().catch(console.error);
