import { describe, it, expect, afterAll } from 'vitest';
import { randomUUID } from 'crypto';
import { supabaseAdmin } from '../config/supabaseAdmin.js';
import { addOrg } from './addOrgWishlist';

const TEST_ORG_NAME = `TestOrg_${randomUUID()}`;

afterAll(async () => {
	await supabaseAdmin.from('Wishlist').delete().eq('name', TEST_ORG_NAME);
});

describe('addOrg', () => {
	it('should insert an organisation in the the wishlist database', async () => {
		const result = await addOrg(
			TEST_ORG_NAME,
			'London',
			'UK',
			'Tech',
			'Definitely do evil',
			'Large',
			'www.google.com/imageishere'
		);

		expect(result).toBeDefined();
		expect(Array.isArray(result)).toBe(true);
		expect(result.length).toBeGreaterThan(0);

		const org = result[0];
		expect(org.name).toBe(TEST_ORG_NAME);
		expect(org.city).toBe('London');
		expect(org.country).toBe('UK');
		expect(org.industry).toBe('Tech');
		expect(org.description).toBe('Definitely do evil');
		expect(org.size).toBe('Large');
		expect(org.img_url).toBe('www.google.com/imageishere');
	});
});
