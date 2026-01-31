
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

const MAPPINGS: Record<string, string> = {
  'ChatGPT': 'ChatGPT Teams',
  'Midjourney': 'Midjourney v6',
  'Claude': 'Claude 3.5 Sonnet',
  'Cursor': 'Cursor AI'
};

async function normalizeNames() {
  console.log('--- Normalizing Product Names ---');
  const { data: products } = await supabase.from('products').select('id, name');

  for (const p of products || []) {
    let newName = p.name.trim(); // Trim whitespace

    // Fuzzy match mappings
    for (const [key, target] of Object.entries(MAPPINGS)) {
      if (newName.includes(key) && newName !== target) {
         // Specific checks to avoid over-renaming e.g. "Cursor AI" -> "Cursor AI AI"
         if (key === 'Cursor' && newName === 'Cursor AI') continue;

         console.log(`Renaming "${p.name}" -> "${target}"`);
         newName = target;
      }
    }

    if (newName !== p.name) {
      await supabase.from('products').update({ name: newName }).eq('id', p.id);
    }
  }
}

normalizeNames();
