import { supabase } from '../config/supabase.js';
import { SupabaseClient } from '@supabase/supabase-js';

export async function deleteRelationshipUserOrg(
	userID: number,
	organisationIDs: Array<number>,
	client: SupabaseClient = supabase
) {
	const { error } = await client
		.from('User-Wishlist')
		.delete()
		.eq('user_fk', userID)
		.in('wishlist_fk', organisationIDs);

	if (error) {
		throw new Error(error.message);
	}

	return { success: true, deletedCount: organisationIDs.length };
}
