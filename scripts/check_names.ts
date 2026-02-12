
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

async function main() {
  console.log('--- Checking Tool Names ---');
  const terms = ['Replit', 'GitHub Copilot', 'Notion AI'];

  for (const term of terms) {
      const { data, error } = await supabase
        .from('products')
        .select('name')
        .ilike('name', `%${term}%`);

      if (error) console.error(error);
      else console.log(`Search '${term}':`, data);
  }
}

main().catch(console.error);
