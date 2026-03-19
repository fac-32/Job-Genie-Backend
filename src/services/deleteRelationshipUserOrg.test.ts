import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { randomUUID } from 'crypto';
import { supabaseAdmin } from '../config/supabaseAdmin.js';
import { deleteRelationshipUserOrg } from './deleteRelationshipUserOrg';

const TEST_USERNAME = `test_delRel_${randomUUID()}`;
const TEST_EMAIL = `${TEST_USERNAME}@test.com`;
const TEST_ORG_NAME = `TestOrg_delRel_${randomUUID()}`;

let authUserId: string;
let testUserId: number;
let testOrgId: number;

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
				phone: '07700000004',
				loc_postcode: 'EC1A 1BB',
				loc_country: 'UK',
				search_radius: 10,
			},
			{ onConflict: 'auth_user_id' }
		)
		.select('id')
		.single();

	testUserId = userData!.id;

	const { data: orgData } = await supabaseAdmin
		.from('Wishlist')
		.insert({
			name: TEST_ORG_NAME,
			city: 'London',
			country: 'UK',
			industry: 'Tech',
			description: 'Test org for delete rel',
			size: 'Medium',
		})
		.select('id')
		.single();

	testOrgId = orgData!.id;

	await supabaseAdmin.from('User-Wishlist').insert({
		user_fk: testUserId,
		wishlist_fk: testOrgId,
		wishlisted_rejected: 'wishlisted',
	});
});

afterAll(async () => {
	// Safety delete — no-op if the test already deleted the row
	await supabaseAdmin.from('User-Wishlist').delete().eq('user_fk', testUserId);
	await supabaseAdmin.from('Users').delete().eq('auth_user_id', authUserId);
	await supabaseAdmin.from('Wishlist').delete().eq('name', TEST_ORG_NAME);
	await supabaseAdmin.auth.admin.deleteUser(authUserId);
});

describe('deleteRelationshipUserOrg', () => {
	it('should delete relationships between specific user and specific organisations', async () => {
		const result = await deleteRelationshipUserOrg(
			testUserId,
			[testOrgId],
			supabaseAdmin
		);

		expect(result).toBeDefined();
		expect(result.success).toBe(true);
		expect(result.deletedCount).toBe(1);
	});
});
