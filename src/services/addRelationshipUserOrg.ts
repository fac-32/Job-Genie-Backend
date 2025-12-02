import { supabase } from '../config/supabase';

// this function adds one or multiple relationships to the database, 
// accepting a userID and an array of one or more entries which are Org IDs
// the array of org IDs is then mapped into an array of objects which contain
// user_id and organisation_id. Supabase accepts objects or an array, so its fine for
// both one, or multiple relationships being added at a time!

export async function addRelationshipUserOrg (
   userID: number,
   organisationIDs: Array<number>) {

        
        const relationships = organisationIDs.map(orgID => ({
            user_fk: userID,
            wishlist_fk: orgID
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