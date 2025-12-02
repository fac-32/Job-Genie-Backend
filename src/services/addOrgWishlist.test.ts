import {describe, it, expect} from 'vitest';
import {addOrg} from './addOrgWishlist';

describe('addOrg', () => {
    it('should insert an organisation in the the wishlist database', async () => {
        const result = await addOrg('Google', 'London', 'UK', 'Tech', 'Definitely do evil', 'Large');

        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBeGreaterThan(0);
        
        const org = result[0]; 
        expect(org.name).toBe('Google');
        expect(org.city).toBe('London');
        expect(org.country).toBe('UK');
        expect(org.industry).toBe('Tech');
        expect(org.description).toBe('Definitely do evil');
        expect(org.size).toBe('Large');
    });
});