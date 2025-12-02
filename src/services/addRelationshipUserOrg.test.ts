import {describe, it, expect} from 'vitest';
import {addRelationshipUserOrg} from './addRelationshipUserOrg';



describe('addRelationshipUserOrg', () => {
    it('should create a relationship between user and orgs{s}', async () => {
        const result = await addRelationshipUserOrg(7, [1, 2]);

        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBeGreaterThan(0);
        
        const firstRelationship = result[0];
        const secondRelationship = result[1];
        expect(firstRelationship.user_fk).toBe(7);
        expect(firstRelationship.wishlist_fk).toBe(1);
        expect(secondRelationship.user_fk).toBe(7);
        expect(secondRelationship.wishlist_fk).toBe(2);
    });
});