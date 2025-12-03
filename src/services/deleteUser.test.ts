import {describe, it, expect} from 'vitest';
import {deleteUser} from './deleteUser';



describe('deleteUser', () => {
    it('should delete a User from the database. All org relationships autoamtically removed by supabase', async () => {
        const result = await deleteUser('Monsoon666');

        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBeGreaterThan(0);
        
        const user = result[0]; 
        expect(user.username).toBe('Monsoon666');
        expect(user.email).toBe('jinkx@seattle.com');
        expect(user.first_name).toBe('Jinkx');
        expect(user.last_name).toBe('Monsoon');
    });
});