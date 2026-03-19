import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { randomUUID } from 'crypto';
import { supabaseAdmin } from '../config/supabaseAdmin.js';
import { addUser } from './addUser';

const TEST_USERNAME = `test_addUser_${randomUUID()}`;
const TEST_EMAIL = `${TEST_USERNAME}@test.com`;

let authUserId: string;

beforeAll(async () => {
	const { data } = await supabaseAdmin.auth.admin.createUser({
		email: TEST_EMAIL,
		password: 'test-password-123',
		email_confirm: true,
	});
	authUserId = data.user!.id;
	// Delete any auto-created Users row from DB trigger so addUser can insert fresh
	await supabaseAdmin.from('Users').delete().eq('auth_user_id', authUserId);
});

afterAll(async () => {
	await supabaseAdmin.from('Users').delete().eq('auth_user_id', authUserId);
	await supabaseAdmin.auth.admin.deleteUser(authUserId);
});

describe('addUser', () => {
	it('should insert a user into the supabase database', async () => {
		const testUser = {
			auth_user_id: authUserId,
			username: TEST_USERNAME,
			email: TEST_EMAIL,
			first_name: 'Anson',
			last_name: 'Chung',
			phone: '07995304200',
			loc_postcode: 'SE9 9SX',
			loc_country: 'UK',
			search_radius: 20,
		};

		const result = await addUser(testUser, supabaseAdmin);

		expect(result).toBeDefined();
		expect(Array.isArray(result)).toBe(true);
		expect(result.length).toBeGreaterThan(0);

		const user = result[0];
		expect(user.username).toBe(TEST_USERNAME);
		expect(user.email).toBe(TEST_EMAIL);
		expect(user.first_name).toBe('Anson');
		expect(user.last_name).toBe('Chung');
	});
});
