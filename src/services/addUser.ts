import { supabase } from '../config/supabase';

type addUserObject = {
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    phone: string;
    loc_postcode?: string;
    loc_country?: string;
    search_radius?: number;
}

export async function addUser (
    newUser: addUserObject
    ) {
        const { data, error } = await supabase
            .from('Users')
            .insert(
                newUser
            )
            .select();

        if (error) {
            throw new Error(error.message);
        }
        
        return data;

    }
