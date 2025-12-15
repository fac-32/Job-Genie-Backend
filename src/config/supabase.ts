import { createClient } from '@supabase/supabase-js';
import './environment.js'; // Load environment variables

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// Only throw error if Supabase features are actually needed
// For development, allow running without Supabase credentials
if (!supabaseUrl || !supabaseKey) {
	console.warn(
		'⚠️  Warning: Supabase credentials not configured. Auth and wishlist features will not work.'
	);
	console.warn(
		'📝 Create a .env file with SUPABASE_URL and SUPABASE_ANON_KEY to enable these features.'
	);
}

// Create client with dummy values if credentials missing (for development)
const url = supabaseUrl || 'https://placeholder.supabase.co';
const key = supabaseKey || 'placeholder-anon-key';

export const supabase = createClient(url, key);
