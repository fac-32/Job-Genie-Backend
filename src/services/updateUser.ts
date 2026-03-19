import { supabase } from '../config/supabase.js';
import { SupabaseClient } from '@supabase/supabase-js';

type updateUserObject = {
	email?: string;
	first_name?: string;
	last_name?: string;
	phone?: string;
	loc_postcode?: string;
	loc_country?: string;
	search_radius?: number;
};

export async function updateUser(
	username: string,
	updateProperties: updateUserObject,
	client: SupabaseClient = supabase
) {
	const { data, error } = await client
		.from('Users')
		.update(updateProperties)
		.eq('username', username)
		.select();

	if (error) {
		throw new Error(error.message);
	}

	return data;
}
