import { supabase } from '../config/supabase.js';
import { SupabaseClient } from '@supabase/supabase-js';

export async function deleteUser(
	username: string,
	client: SupabaseClient = supabase
) {
	const { data, error } = await client
		.from('Users')
		.delete()
		.eq('username', username)
		.select();

	if (error) {
		throw new Error(error.message);
	}

	return data;
}
