
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function deleteDuplicate() {
  const idToDelete = '8e5bd487-af9d-42f6-bdbb-e77592d52203';
  console.log(`Deleting Product ID: ${idToDelete}`);

  // Delete reports first (cascade might differ, safer to do explicit)
  const { error: rError } = await supabase.from('expert_reports').delete().eq('product_id', idToDelete);
  if (rError) console.error('Reports delete error:', rError);
  else console.log('Reports deleted.');

  // Delete metrics
  const { error: mError } = await supabase.from('metrics').delete().eq('product_id', idToDelete);
  if (mError) {
      // Metrics might not exist, ignoring
  }

  // Delete product
  const { error: pError } = await supabase.from('products').delete().eq('id', idToDelete);
  if (pError) console.error('Product delete error:', pError);
  else console.log('Product deleted.');
}

deleteDuplicate();
