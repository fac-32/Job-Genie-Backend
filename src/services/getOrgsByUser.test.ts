import {describe, it, expect} from 'vitest';
import {getOrgsByUser} from './getOrgsByUser';



describe('getOrgsByUser', () => {
    it('should return all org IDs related to a single user', async () => {
        const result = await getOrgsByUser(8);

        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBeGreaterThan(0);

        const orgs = result;

        let responseLength = result.length;

        for (let i = 0; i < responseLength; i++) {
            expect(orgs[i].user_fk).toBe(8);
            expect(typeof orgs[i].wishlist_fk).toBe('number');
        }
    });
});