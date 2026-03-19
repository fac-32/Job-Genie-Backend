import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { randomUUID } from 'crypto';
import { supabaseAdmin } from '../config/supabaseAdmin.js';
import { updateUser } from './updateUser';

const TEST_USERNAME = `test_updateUser_${randomUUID()}`;
const TEST_EMAIL = `${TEST_USERNAME}@test.com`;

let authUserId: string;

const updateUserData1 = {
	email: 'sharon@sharon.com',
	first_name: 'Sharon',
	last_name: 'McMansion',
	phone: '077934942023',
	loc_postcode: 'SE5 8RL',
	loc_country: 'France',
	search_radius: 10,
};

const updateUserData2 = {
	search_radius: 50,
};

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
			first_name: 'Initial',
			last_name: 'User',
			phone: '07700000002',
			loc_postcode: 'EC1A 1BB',
			loc_country: 'UK',
			search_radius: 5,
		},
		{ onConflict: 'auth_user_id' }
	);
});

afterAll(async () => {
	await supabaseAdmin.from('Users').delete().eq('auth_user_id', authUserId);
	await supabaseAdmin.auth.admin.deleteUser(authUserId);
});

describe('updateUser', () => {
	it('should update a users details in the database, but only the properties provided in the object', async () => {
		const resultOne = await updateUser(
			TEST_USERNAME,
			updateUserData1,
			supabaseAdmin
		);

		expect(resultOne).toBeDefined();
		expect(Array.isArray(resultOne)).toBe(true);
		expect(resultOne.length).toBeGreaterThan(0);

		const amendedUserDataOne = resultOne[0];
		expect(amendedUserDataOne.username).toBe(TEST_USERNAME);
		expect(amendedUserDataOne.email).toBe(updateUserData1.email);
		expect(amendedUserDataOne.first_name).toBe(updateUserData1.first_name);
		expect(amendedUserDataOne.last_name).toBe(updateUserData1.last_name);
		expect(amendedUserDataOne.phone).toBe(updateUserData1.phone);
		expect(amendedUserDataOne.loc_country).toBe(updateUserData1.loc_country);
		expect(amendedUserDataOne.loc_postcode).toBe(updateUserData1.loc_postcode);
	});

	it('should update a users details in the database, but only the properties provided in the object', async () => {
		const resultTwo = await updateUser(
			TEST_USERNAME,
			updateUserData2,
			supabaseAdmin
		);

		expect(resultTwo).toBeDefined();
		expect(Array.isArray(resultTwo)).toBe(true);
		expect(resultTwo.length).toBeGreaterThan(0);

		const amendedUserDataTwo = resultTwo[0];
		expect(amendedUserDataTwo.username).toBe(TEST_USERNAME);
		expect(amendedUserDataTwo.email).toBe(updateUserData1.email);
		expect(amendedUserDataTwo.first_name).toBe(updateUserData1.first_name);
		expect(amendedUserDataTwo.last_name).toBe(updateUserData1.last_name);
		expect(amendedUserDataTwo.phone).toBe(updateUserData1.phone);
		expect(amendedUserDataTwo.loc_country).toBe(updateUserData1.loc_country);
		expect(amendedUserDataTwo.loc_postcode).toBe(updateUserData1.loc_postcode);
		expect(amendedUserDataTwo.search_radius).toBe(
			updateUserData2.search_radius
		);
	});
});
