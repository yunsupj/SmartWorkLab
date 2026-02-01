import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function auditTools() {
  console.log('--- Auditing Products ---');
  const { data: tools, error } = await supabase.from('products').select('id, name').order('name');

  if (error) {
    console.error(error);
    return;
  }

  console.log(`Found ${tools.length} tools.`);
  tools.forEach(t => {
    const slug = t.name.toLowerCase().replace(/\s+/g, '-');
    console.log(`[${t.name}] -> Slug: ${slug} -> ID: ${t.id}`);
  });

  // Check for duplicates
  const nameMap = new Map<string, number>();
  tools.forEach(t => {
      const n = t.name.trim(); // normalization
      nameMap.set(n, (nameMap.get(n) || 0) + 1);
  });

  console.log('--- Checking Duplicates ---');
  let dupsFound = false;
  nameMap.forEach((count, name) => {
      if (count > 1) {
          console.error(`❌ Duplicate Found: "${name}" (${count} entries)`);
          dupsFound = true;
      }
  });
  if (!dupsFound) console.log('✅ No product duplicates found.');
}

auditTools();
