import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { randomUUID } from 'crypto';
import { supabaseAdmin } from '../config/supabaseAdmin.js';
import { addRelationshipUserOrg } from './addRelationshipUserOrg';

const TEST_USERNAME = `test_addRel_${randomUUID()}`;
const TEST_EMAIL = `${TEST_USERNAME}@test.com`;
const TEST_ORG_NAME_1 = `TestOrg1_${randomUUID()}`;
const TEST_ORG_NAME_2 = `TestOrg2_${randomUUID()}`;

let authUserId: string;
let testUserId: number;
let testOrgId1: number;
let testOrgId2: number;

beforeAll(async () => {
	const { data: authData } = await supabaseAdmin.auth.admin.createUser({
		email: TEST_EMAIL,
		password: 'test-password-123',
		email_confirm: true,
	});
	authUserId = authData.user!.id;

	// Upsert handles both: trigger auto-created a row, or no trigger
	const { data: userData } = await supabaseAdmin
		.from('Users')
		.upsert(
			{
				auth_user_id: authUserId,
				username: TEST_USERNAME,
				email: TEST_EMAIL,
				first_name: 'Test',
				last_name: 'User',
				phone: '07700000003',
				loc_postcode: 'EC1A 1BB',
				loc_country: 'UK',
				search_radius: 10,
			},
			{ onConflict: 'auth_user_id' }
		)
		.select('id')
		.single();

	testUserId = userData!.id;

	const { data: orgData1 } = await supabaseAdmin
		.from('Wishlist')
		.insert({
			name: TEST_ORG_NAME_1,
			city: 'London',
			country: 'UK',
			industry: 'Tech',
			description: 'Test org 1',
			size: 'Medium',
		})
		.select('id')
		.single();

	testOrgId1 = orgData1!.id;

	const { data: orgData2 } = await supabaseAdmin
		.from('Wishlist')
		.insert({
			name: TEST_ORG_NAME_2,
			city: 'London',
			country: 'UK',
			industry: 'Finance',
			description: 'Test org 2',
			size: 'Small',
		})
		.select('id')
		.single();

	testOrgId2 = orgData2!.id;
});

afterAll(async () => {
	await supabaseAdmin.from('User-Wishlist').delete().eq('user_fk', testUserId);
	await supabaseAdmin.from('Users').delete().eq('auth_user_id', authUserId);
	await supabaseAdmin.from('Wishlist').delete().eq('name', TEST_ORG_NAME_1);
	await supabaseAdmin.from('Wishlist').delete().eq('name', TEST_ORG_NAME_2);
	await supabaseAdmin.auth.admin.deleteUser(authUserId);
});

describe('addRelationshipUserOrg', () => {
	it('should create a relationship between user and org(s)', async () => {
		const result = await addRelationshipUserOrg(
			testUserId,
			[testOrgId1, testOrgId2],
			['wishlisted', 'rejected'],
			supabaseAdmin
		);

		expect(result).toBeDefined();
		expect(Array.isArray(result)).toBe(true);
		expect(result.length).toBeGreaterThan(0);

		const firstRelationship = result[0];
		const secondRelationship = result[1];
		expect(firstRelationship.user_fk).toBe(testUserId);
		expect(firstRelationship.wishlist_fk).toBe(testOrgId1);
		expect(firstRelationship.wishlisted_rejected).toBe('wishlisted');
		expect(secondRelationship.user_fk).toBe(testUserId);
		expect(secondRelationship.wishlist_fk).toBe(testOrgId2);
		expect(secondRelationship.wishlisted_rejected).toBe('rejected');
	});
});
