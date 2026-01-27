import { createClient } from '@supabase/supabase-js';

// These should be in .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // Service role for backend admin tasks

// Fallback for build time or missing keys to prevent crash
const options = {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  }
};

export const supabaseAdmin = (supabaseUrl && supabaseKey)
  ? createClient(supabaseUrl, supabaseKey, options)
  : null;
