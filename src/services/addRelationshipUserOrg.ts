import { supabase } from '../config/supabase';

// this function adds one or multiple relationships to the database,
// accepting a userID and an array of one or more entries which are Org IDs
// the array of org IDs is then mapped into an array of objects which contain
// user_id and organisation_id. Supabase accepts objects or an array, so its fine for
// both one, or multiple relationships being added at a time!

// now also takes a wishlisted or rejected array of strings to indicate wheher an object has been wislisted or rejected

type WishlistStatus = 'wishlisted' | 'rejected';

export async function addRelationshipUserOrg(
	userID: number,
	organisationIDs: Array<number>,
	wishlistedOrRejected: Array<WishlistStatus>
) {
	if (organisationIDs.length !== wishlistedOrRejected.length) {
		throw new Error('Organisation and wishlist arrays not same length');
	}

	const relationships = organisationIDs.map((orgID, index) => ({
		user_fk: userID,
		wishlist_fk: orgID,
		wishlisted_rejected: wishlistedOrRejected[index],
	}));

	const { data, error } = await supabase
		.from('User-Wishlist')
		.insert(relationships)
		.select();

	if (error) {
		throw new Error(error.message);
	}

	return data;
}
