
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load env
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf-8');
  envConfig.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
      process.env[key.trim()] = value.trim();
    }
  });
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function updateReview(toolName: string, newSummary: string) {
  console.log(`Processing ${toolName}...`);
  // 1. Get Product ID
  const { data: product, error: pError } = await supabase
    .from('products')
    .select('id')
    .eq('name', toolName)
    .single();

  if (pError || !product) {
    console.error(`❌ Product ${toolName} not found:`, pError);
    return;
  }

  // 2. Update English Review
  const { error: rError } = await supabase
    .from('expert_reports')
    .update({ summary: newSummary })
    .eq('product_id', product.id)
    .eq('locale', 'en');

  if (rError) {
    console.error(`❌ Failed to update ${toolName}:`, rError);
  } else {
    console.log(`✅ Successfully updated ${toolName}.`);
  }
}

const notionContent = `
## Business Use Case: The Corporate Wiki Killer

Notion AI isn't just a "wrapper" around GPT-4; it's a context-aware intelligence layer that sits on top of your company's entire knowledge base. For enterprises, the value proposition isn't text generation—it's information retrieval.

In a traditional setup, an employee spends an average of 1.8 hours per day searching for information (McKinsey Global Institute). Notion AI reduces this by indexing every page, database, and comment in your workspace. When you ask, "What is our Q3 brand strategy?", it doesn't hallucinate an answer; it pulls the exact paragraph from the Strategy Doc written three months ago and cites the source.

### The Q&A Feature
The standout feature for 2026 is **Notion Q&A**. Unlike ChatGPT, which knows nothing about your internal meeting notes, Notion Q&A acts as an omniscient colleague. It can answer:
- "Who is the engineering lead for Project Alpha?"
- "Summarize the last 5 marketing syncs."
- "What are the blockers listed in the Q2 Roadmap?"

## ROI Evaluation

For a team of 50 employees, the math is compelling.

$$
\\text{ROI} = \\frac{(\\text{Monthly Savings} \\times 12) - \\text{Annual Cost}}{\\text{Annual Cost}} \\times 100
$$

**Variables:**
- **Time Saved:** Conservative estimate of 15 minutes per employee/day.
- **Hourly Cost:** Average blended rate of $60/hr.
- **Tool Cost:** $10/user/month.

**Calculation:**
- **Daily Savings:** $15 \\text{ mins} \\times 50 \\text{ users} = 12.5 \\text{ hours}$
- **Daily Value:** $12.5 \\times \\$60 = \\$750$
- **Monthly Value:** $\\$750 \\times 20 \\text{ days} = \\$15,000$
- **Monthly Cost:** $50 \\times \\$10 = \\$500$

$$
\\text{Monthly ROI} = \\frac{15,000 - 500}{500} \\times 100 = 2,900\\%
$$

Even if adoption is only 20%, the system pays for itself in day one.

## Detailed Feature Analysis

### 1. Writing & Editing
While the generative text is standard (powered by Anthropic/OpenAI models), the **integration** is superior. You can highlight a messy meeting transcript and click "Extract Action Items," and Notion AI will not only list them but formatted them as checkboxes ready to be converted into database tasks.

### 2. Database Autofill
This is a slept-on feature. You can add a property to a database called "AI Summary" or "AI Sentiment." For a CRM, Notion AI can automatically read the sales call notes and fill the "Sentiment" column with "Positive" or "Negative," automating pipeline analysis.

### 3. Smart Search
The search experience is fundamentally different. It uses semantic search (vector embeddings) rather than keyword matching. Searching for "how to deploy" will surface the Engineering Handbook even if the exact keyword "deploy" isn't in the title.

## Critical Flaws (The "Low Value" Check)
To be balanced, Notion AI has weaknesses:
1.  **Speed**: It can be sluggish on large workspaces. Indexing takes time.
2.  **Cost**: It is an add-on, not included in the Enterprise plan, which frustrates procurement teams.
3.  **Chat Limitations**: It is not a general purpose chatbot. It struggles with creative writing tasks outside the context of your docs.

## Verdict
If your company already lives in Notion, this is an automatic purchase. The search capabilities alone replace the need for internal wiki curators. If you don't use Notion, this feature isn't enough to force a migration, but it is the strongest retention moat Notion has built to date.
`;

const replitContent = `
## Business Use Case: From Idea to SaaS in Minutes

Replit has transformed from a browser-based IDE for students into a legitimate cloud platform for shipping software. The release of **Replit Agent** in late 2025 changed the landscape. It is no longer just an editor; it is an autonomous developer that can provision infrastructure, write backend logic, and deploy a frontend with a single prompt.

For startups, Replit is the "Zero-to-One" accelerator. It removes the DevOps tax. You don't need to configure AWS VPCs, set up Docker containers, or manage SSL certificates. You hit "Run," and your app is live.

## ROI Evaluation

For a solo founder or small team, Replit competes with hiring a DevOps engineer.

$$
\\text{ROI} = \\frac{(\\text{DevOps Hours Saved} \\times \\text{Hourly Rate}) - \\text{Annual Cost}}{\\text{Annual Cost}} \\times 100
$$

**Variables:**
- **Setup Time Saved:** 40 hours (initial config + ongoing maintenance/month).
- **Contractor Rate:** $100/hr (DevOps rates are high).
- **Tool Cost:** $240/year (Core Plan).

**Calculation:**
- **Annual Savings:** $40 \\text{ hours} \\times 12 \\times \\$100 = \\$48,000$
- **Annual Cost:** $240$

$$
\\text{ROI} = \\frac{48,000 - 240}{240} \\times 100 = 19,900\\%
$$

This astronomical ROI reflects the reality that for non-technical founders, the alternative isn't "cheaper hosting"—it's *not building the product at all*.

## Comparison: Replit vs. Vercel vs. Heroku

| Feature | Replit | Vercel | Heroku |
| :--- | :--- | :--- | :--- |
| **Primary Use** | Build & Deploy | Frontend Deploy | Backend PaaS |
| **AI Integration** | Native (Agent) | v0 (UI Only) | None |
| **Database** | Integrated Postgres | Third-party | Integrated Postgres |
| **Dev Environment** | Cloud IDE | Local (VS Code) | Local |
| **Pricing** | $20/mo | $20/mo | Dyno-based |

**Why Replit Wins for Prototyping:**
Vercel is excellent for Next.js, but if you need a Python backend, a vector database, and a background worker, you have to piece them together. Replit gives you a monolithic environment where you can run a Python Flask server and a React frontend in the same repl, sharing state instantly.

## Replit Agent: The Game Changer
The Agent doesn't just autocomplete code; it *plans*.
1.  **Reasoning**: It breaks down a prompt ("Build a CRM") into steps (Schema, API, UI).
2.  **Execution**: It writes files, installs packages (\`npm install\`), and fixes its own runtime errors.
3.  **Deployment**: It handles the environment variables and secrets automatically.

## Critical Flaws
1.  **Vendor Lock-in**: Moving a complex Replit project to AWS later is painful. You are building in their walled garden.
2.  **Performance Limits**: The standard containers sleep. For high-traffic production apps, you still need traditional cloud scaling (though Replit Deployments is improving this).
3.  **Cost Scaling**: Computing units can get expensive if you leave Agents running loops.

## Verdict
Replit is the paramount tool for the "AI Engineer." If you are building internal tools, MVPs, or proof-of-concepts, there is no faster way to ship. It is worth the subscription for the Agent alone, which acts as a junior developer on call 24/7.
`;

async function main() {
  console.log('🚀 Starting Content Expansion...');

  await updateReview('Notion AI', notionContent);
  await updateReview('Replit AI', replitContent);

  console.log('\n🎉 Content Updates Complete!');
}

main().catch(console.error);
