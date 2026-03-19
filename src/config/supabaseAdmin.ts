import { createClient } from '@supabase/supabase-js';
import './environment.js'; // Load environment variables

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
	throw new Error('Missing Supabase URL or service role key');
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
