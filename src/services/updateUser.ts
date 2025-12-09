import { supabase } from '../config/supabase';

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
	updateProperties: updateUserObject
) {
	const { data, error } = await supabase
		.from('Users')
		.update(updateProperties)
		.eq('username', username)
		.select();

	if (error) {
		throw new Error(error.message);
	}

	return data;
}
