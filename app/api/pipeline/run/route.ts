import { NextResponse } from 'next/server';
import { ScoutAgent } from '@/lib/agents/scout';
import { AnalystAgent } from '@/lib/agents/analyst';
import { WriterAgent } from '@/lib/agents/writer';
import { PublisherAgent } from '@/lib/agents/publisher';
import { FinalPost } from '@/lib/agents/types';

export async function POST() {
  try {
    const scout = new ScoutAgent();
    const analyst = new AnalystAgent();
    const writer = new WriterAgent();
    const publisher = new PublisherAgent();

    // 1. Scout
    const tools = await scout.findTrendingTools();
    const results = [];

    for (const tool of tools) {
      // 2. Analyst
      const analysis = await analyst.analyze(tool);

      if (!analysis.isApproved) {
        results.push({ name: tool.name, status: 'REJECTED', reason: analysis.rejectionReason });
        continue;
      }

      // 3. Writer
      const drafts = await writer.generateContent(tool, analysis);

      const finalPost: FinalPost = {
        analysis,
        drafts,
        toolData: tool
      };

      // 4. Publisher
      await publisher.publish(finalPost);
      results.push({ name: tool.name, status: 'PUBLISHED' });
    }

    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Pipeline Failed' }, { status: 500 });
  }
}
