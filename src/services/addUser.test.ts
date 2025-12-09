import { describe, it, expect } from 'vitest';
import { addUser } from './addUser';

const testUser = {
	username: 'Anson',
	email: 'gitlover99@git.com',
	first_name: 'Anson',
	last_name: 'Chung',
	phone: '07995304200',
	loc_postcode: 'SE9 9SX',
	loc_country: 'UK',
	search_radius: 20,
};

describe('addUser', () => {
	it('should insert a user into the supabase database', async () => {
		const result = await addUser(testUser);

		expect(result).toBeDefined();
		expect(Array.isArray(result)).toBe(true);
		expect(result.length).toBeGreaterThan(0);

		const user = result[0];
		expect(user.username).toBe('Anson');
		expect(user.email).toBe('gitlover99@git.com');
		expect(user.first_name).toBe('Anson');
		expect(user.last_name).toBe('Chung');
	});
});
