
import fs from 'fs';
import path from 'path';
import { AnalystAgent } from '../lib/agents/analyst';
import { WriterAgent } from '../lib/agents/writer';
import { RawToolData, FinalPost } from '../lib/agents/types';

const TOOLS_FILE = path.join(process.cwd(), 'data/top_50_tools.json');
const OUTPUT_FILE = path.join(process.cwd(), 'data/top_50_generated.json');

async function main() {
  console.log('🚀 Starting Batch Content Generation...');

  if (!fs.existsSync(TOOLS_FILE)) {
    console.error(`❌ Data file not found: ${TOOLS_FILE}`);
    process.exit(1);
  }

  const toolsData = JSON.parse(fs.readFileSync(TOOLS_FILE, 'utf-8'));
  console.log(`📋 Loaded ${toolsData.length} tools from seed data.`);

  const analyst = new AnalystAgent();
  const writer = new WriterAgent();
  const results: FinalPost[] = [];

  for (const tool of toolsData) {
    console.log(`\n-----------------------------------`);
    console.log(`🤖 Processing: ${tool.name}`);

    // Map seed data to RawToolData
    const rawData: RawToolData = {
      name: tool.name,
      websiteUrl: tool.website_url,
      tagline: tool.description, // Using desc as tagline fallback
      description: tool.description,
      source: 'Manual',
      sourceUrl: tool.website_url,
      pricing: tool.pricing_text,
      userComments: [], // Not used because we have manual pros/cons
      manualPros: tool.known_pros,
      manualCons: tool.known_cons,
    };

    try {
      // 1. Analyze
      const analysis = await analyst.analyze(rawData);

      if (!analysis.isApproved) {
        console.warn(`⚠️ Skipped ${tool.name}: ${analysis.rejectionReason}`);
        continue;
      }

      // 2. Write Content
      const drafts = await writer.generateContent(rawData, analysis);

      // 3. Store Result
      results.push({
        analysis,
        drafts,
        toolData: rawData
      });

      console.log(`✅ Completed: ${tool.name}`);
    } catch (error) {
      console.error(`❌ Error processing ${tool.name}:`, error);
    }
  }

  // Save Results
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2));
  console.log(`\n🎉 Batch Generation Complete! Saved ${results.length} posts to ${OUTPUT_FILE}`);
}

main().catch(console.error);
