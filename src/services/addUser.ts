import { supabase } from '../config/supabase';

export async function addUser (
    username: string,
    email: string, 
    firstName: string,
    lastName: string) {
        const { data, error } = await supabase
            .from('Users')
            .insert(
                {username: username,
                email: email,
                first_name: firstName,
                last_name: lastName
                }
            )
            .select();

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }
