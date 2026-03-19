import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { randomUUID } from 'crypto';
import { supabaseAdmin } from '../config/supabaseAdmin.js';
import { deleteUser } from './deleteUser';

const TEST_USERNAME = `test_deleteUser_${randomUUID()}`;
const TEST_EMAIL = `${TEST_USERNAME}@test.com`;

let authUserId: string;

beforeAll(async () => {
	const { data } = await supabaseAdmin.auth.admin.createUser({
		email: TEST_EMAIL,
		password: 'test-password-123',
		email_confirm: true,
	});
	authUserId = data.user!.id;

	// Upsert handles both: trigger auto-created a row, or no trigger
	await supabaseAdmin.from('Users').upsert(
		{
			auth_user_id: authUserId,
			username: TEST_USERNAME,
			email: TEST_EMAIL,
			first_name: 'Jinkx',
			last_name: 'Monsoon',
			phone: '07700000001',
			loc_postcode: 'SE1 1AA',
			loc_country: 'UK',
			search_radius: 10,
		},
		{ onConflict: 'auth_user_id' }
	);
});

afterAll(async () => {
	// Safety delete — no-op if the test already deleted the row
	await supabaseAdmin.from('Users').delete().eq('auth_user_id', authUserId);
	await supabaseAdmin.auth.admin.deleteUser(authUserId);
});

describe('deleteUser', () => {
	it('should delete a User from the database. All org relationships automatically removed by supabase', async () => {
		const result = await deleteUser(TEST_USERNAME, supabaseAdmin);

		expect(result).toBeDefined();
		expect(Array.isArray(result)).toBe(true);
		expect(result.length).toBeGreaterThan(0);

		const user = result[0];
		expect(user.username).toBe(TEST_USERNAME);
		expect(user.email).toBe(TEST_EMAIL);
		expect(user.first_name).toBe('Jinkx');
		expect(user.last_name).toBe('Monsoon');
	});
});
