
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

async function checkExpertsTable() {
  console.log('--- Checking Expert Reports Table ---');

  // 1. Check with Service Role (Should succeed if table exists)
  const adminClient = createClient(supabaseUrl, supabaseServiceKey);
  const { data, error } = await adminClient.from('expert_reports').select('count', { count: 'exact', head: true });

  if (error) {
      console.error('Service Role Access Failed:', error);
  } else {
      console.log('Service Role Access OK. Count:', data);
  }

  // 2. We can't easily check RLS policies from client, but we can try to insert as anon and see failure
  // Usually write is protected.
  console.log('Use the Supabase Dashboard SQL Editor to allow authenticated inserts:');
  console.log(`
    create policy "Allow authenticated uploads"
    on expert_reports
    for insert
    to authenticated
    with check (true);

    create policy "Allow authenticated updates"
    on expert_reports
    for update
    to authenticated
    using (true);
  `);
}

checkExpertsTable();
