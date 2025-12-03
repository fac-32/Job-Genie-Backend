import { supabase } from '../config/supabase';

export async function deleteUser(username: string) {
    const { data, error } = await supabase
        .from('Users')
        .delete()
        .eq('username', username)
        .select();

    if (error) {
        throw new Error(error.message);
    }
    
    return data;
}