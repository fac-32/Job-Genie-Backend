import { supabase } from '../config/supabase';

export async function deleteRelationshipUserOrg(
	userID: number,
	organisationIDs: Array<number>
) {
	const { error } = await supabase
		.from('User-Wishlist')
		.delete()
		.eq('user_fk', userID)
		.in('wishlist_fk', organisationIDs);

	if (error) {
		throw new Error(error.message);
	}

	return { success: true, deletedCount: organisationIDs.length };
}
