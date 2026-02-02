
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function auditSummaries() {
  const { data: reports, error } = await supabase
    .from('expert_reports')
    .select('id, title, summary, product_id, products(name)');

  if (error) {
    console.error('Error fetching reports:', error);
    return;
  }

  console.log(`Auditing ${reports.length} reports...`);

  let duplicateCount = 0;
  reports.forEach(r => {
      const summary = r.summary || '';
      const firstLine = summary.split('\n')[0].substring(0, 100);

      // Check for the reported repetitive phrase
      if (summary.includes('We analyzed') && summary.includes('found significant pros')) {
          duplicateCount++;
          console.log(`[REPETITIVE] ${r.products?.name}: ${firstLine}...`);
      } else if (summary.length < 200) {
          console.log(`[SHORT] ${r.products?.name}: ${summary}`);
      }
  });

  console.log(`\nFound ${duplicateCount} repetitive summaries.`);

  // Specific checks for deep dive targets
  const targets = ['Jasper', 'Surfer', 'ClickUp'];
  targets.forEach(t => {
      const found = reports.find(r => r.products?.name.toLowerCase().includes(t.toLowerCase()));
      if (found) {
          console.log(`\n[TARGET] ${found.products?.name} Summary Length: ${found.summary.length}`);
      } else {
          console.log(`\n[TARGET] ${t} NOT FOUND`);
      }
  });
}

auditSummaries();
