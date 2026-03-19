import { supabase } from '../config/supabase.js';
import { SupabaseClient } from '@supabase/supabase-js';

type addUserObject = {
	auth_user_id: string;
	username: string;
	email: string;
	first_name: string;
	last_name: string;
	phone: string;
	loc_postcode?: string;
	loc_country?: string;
	search_radius?: number;
};

export async function addUser(
	newUser: addUserObject,
	client: SupabaseClient = supabase
) {
	const { data, error } = await client.from('Users').insert(newUser).select();

	if (error) {
		throw new Error(error.message);
	}

	return data;
}
