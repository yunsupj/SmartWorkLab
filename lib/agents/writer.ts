import { AnalysisResult, ContentDraft, RawToolData } from './types';

export class WriterAgent {
  async generateContent(tool: RawToolData, analysis: AnalysisResult): Promise<Record<string, ContentDraft>> {
    console.log(`✍️ Writer Agent: Generating content for ${tool.name}...`);

    if (!analysis.isApproved) {
      throw new Error("Cannot generate content for rejected tool.");
    }

    // 1. Generate English Master Draft
    const enDraft: ContentDraft = {
      locale: 'en',
      title: `${tool.name} Honest Review: Is it worth the hype?`,
      summary: `We analyzed ${tool.name} and found significant pros but some critical flaws. Here is the honest truth.`,
      body: `
# ${tool.name} Review: The Honest Truth

**Smart Score: ${analysis.smartScore?.total}/10**

## ⚠️ The Reality Check (Cons First)
Before you buy, you need to know about these flaws:
${analysis.criticalFlaws.map(f => `- **${f}**`).join('\n')}

${analysis.cons.map(c => `- ${c}`).join('\n')}

## Why It's Trending
${analysis.pros.map(p => `- ${p}`).join('\n')}

## Who is this for?
Based on our analysis, ${tool.name} is best for users who prioritize **${analysis.pros[0] || 'efficiency'}**. However, if **${analysis.cons[0] || 'price'}** is a dealbreaker for you, consider alternatives.

## Pricing
${tool.pricing || "Unknown"}
`
    };

    // 2. Generate Korean Localized Draft
    const koDraft: ContentDraft = {
      locale: 'ko',
      title: `${tool.name} 솔직 리뷰: 과연 돈 값을 할까?`,
      summary: `${tool.name}을 분석했습니다. 장점도 있지만 치명적인 단점도 발견했습니다.`,
      body: `
# ${tool.name} 리뷰: 솔직한 분석

**스마트 스코어: ${analysis.smartScore?.total}/10**

## ⚠️ 현실 체크 (단점 먼저)
구매하기 전에 다음 단점들을 꼭 확인하세요:
${analysis.criticalFlaws.map(f => `- **${f}**`).join('\n')}

${analysis.cons.map(c => `- ${c}`).join('\n')}

## 왜 트렌딩인가?
${analysis.pros.map(p => `- ${p}`).join('\n')}

## 누구에게 적합한가?
분석 결과, **${analysis.pros[0] || '효율성'}**을 중시하는 분들께 추천합니다. 하지만 **${analysis.cons[0] || '가격'}**이(가) 중요하시다면 다른 대안을 고려해보세요.

## 한국어 지원 및 결제
현재 한국어 지원이 제한적일 수 있으며, 해외 결제가 필요할 수 있습니다.
`
    };

    console.log(`✅ Writer Agent: Generated EN and KO drafts`);

    return {
      en: enDraft,
      ko: koDraft
    };
  }
}
