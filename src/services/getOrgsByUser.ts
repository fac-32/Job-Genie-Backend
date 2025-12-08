import { supabase } from '../config/supabase';

export async function getOrgsByUser(userID: number) {
	const { data, error } = await supabase
		.from('User-Wishlist')
		.select('user_fk, wishlist_fk')
		.eq('user_fk', userID);

	if (error) {
		throw new Error(error.message);
	}

	return data;
}
