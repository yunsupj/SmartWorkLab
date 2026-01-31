
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

async function diagnose() {
    console.log('--- Starting Diagnosis ---');
    console.log('1. Checking URL/Key...');
    if (!supabaseUrl || !supabaseAnonKey) {
        console.error('Missing ENV variables!');
        process.exit(1);
    }
    console.log('URL:', supabaseUrl);

    // 2. Simulate Review Payload
    console.log('2. Simulating Payload Construction...');
    const payload = {
        product_id: 'test-uuid-1234', // Fake ID
        author: 'Diagnostic Script',
        rating: 5,
        summary: 'Testing LaTeX: $E=mc^2$',
        smart_score: { roi: 9, privacy: 5, integration: 8, total: 7.3 },
        status: 'pending',
        locale: 'en',
        updated_at: new Date().toISOString()
    };

    // Verify JSON Integrity
    try {
        const json = JSON.stringify(payload);
        console.log('Payload JSON is valid.');
        console.log('Preview:', json.substring(0, 100) + '...');
    } catch (e) {
        console.error('JSON Stringify Failed:', e);
    }

    // 3. RLS Check (Simulated)
    // We cannot truly simulate "authenticated" state easily without a real JWT from a user login.
    // However, we can try to insert as ANON and see the error.
    // If RLS is ON, Anon insert should fail (401 or 403 or new row checks).

    const client = createClient(supabaseUrl, supabaseAnonKey);
    console.log('3. Attempting Valid Anonymous Read...');
    const { data: readData, error: readError } = await client.from('products').select('count').limit(1);
    if (readError) console.error('Read Error:', readError.message);
    else console.log('Read Success (Anon).');

    console.log('\n--- Diagnosis Complete ---');
    console.log('Note: To fully verify the "Failed to submit" error, please use the browser.');
    console.log('If Browser Error is 42501 (RLS violation), run the SQL policies provided in the plan.');
}

diagnose();
