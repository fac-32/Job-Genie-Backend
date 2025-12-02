import {describe, it, expect} from 'vitest';
import {addUser} from './addUser';



describe('addUser', () => {
    it('should insert a user into the supabase database', async () => {
        const result = await addUser('Savage9000', 'scouse@dragscouse.co.uk', 'Lily', 'Savage');

        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBeGreaterThan(0);
        
        const user = result[0]; 
        expect(user.username).toBe('Savage9000');
        expect(user.email).toBe('scouse@dragscouse.co.uk');
        expect(user.first_name).toBe('Lily');
        expect(user.last_name).toBe('Savage');
    });
});