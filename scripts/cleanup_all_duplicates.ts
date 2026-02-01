import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function cleanupAllDuplicates() {
  console.log('--- Scanning for Duplicate Expert Reports ---');

  // Fetch all reports
  const { data: reports, error } = await supabase
    .from('expert_reports')
    .select('id, product_id, locale, created_at')
    .order('created_at', { ascending: false }); // Latest first

  if (error || !reports) {
    console.error('Error fetching reports:', error);
    return;
  }

  console.log(`Analyzing ${reports.length} total reports...`);

  const seen = new Set<string>();
  const toDelete: string[] = [];

  for (const r of reports) {
    const key = `${r.product_id}_${r.locale}`;
    if (seen.has(key)) {
        // Since we ordered by created_at DESC, the first one seen is the latest.
        // Any subsequent occurrence of the same key is older/duplicate -> DELETE
        toDelete.push(r.id);
    } else {
        seen.add(key);
    }
  }

  console.log(`Found ${toDelete.length} duplicates to delete.`);

  if (toDelete.length > 0) {
      const { error: delError } = await supabase
        .from('expert_reports')
        .delete()
        .in('id', toDelete);

      if (delError) {
          console.error("Failed to delete duplicates:", delError);
      } else {
          console.log("✅ Successfully deleted duplicates.");
      }
  } else {
      console.log("✅ Database is clean.");
  }
}

cleanupAllDuplicates();
