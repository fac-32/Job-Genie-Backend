import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

// Mock requireAuth to inject a fake user and skip token verification
vi.mock('../src/middleware/requireAuth.js', () => ({
	requireAuth: (req: any, _res: any, next: any) => {
		req.user = { id: 'test-uuid-123' };
		next();
	},
}));

// Mock supabase so no real DB calls are made
vi.mock('../src/config/supabase.js', () => {
	const single = vi.fn();
	const selectChain = { eq: vi.fn(), in: vi.fn(), single };
	const insertChain = { select: vi.fn() };
	const deleteChain = { eq: vi.fn(), in: vi.fn() };

	const from = vi.fn((table: string) => {
		if (table === 'Users') {
			return {
				select: () => ({
					eq: () => ({ single: () => ({ data: { id: 1 }, error: null }) }),
				}),
			};
		}
		if (table === 'User-Wishlist') {
			return {
				select: () => ({ eq: () => ({ data: [], error: null }) }),
				insert: () => ({ select: () => ({ data: [], error: null }) }),
				delete: () => ({ eq: () => ({ in: () => ({ error: null }) }) }),
			};
		}
		if (table === 'Wishlist') {
			return {
				select: () => ({
					in: () => ({ data: [], error: null }),
					eq: () => ({
						single: () => ({ data: null, error: { message: 'not found' } }),
					}),
				}),
				insert: () => ({
					select: () => ({
						data: [
							{
								id: 99,
								name: 'Test Co',
								city: 'London',
								country: 'UK',
								industry: 'Tech',
								description: 'A test company',
								size: '1-50',
								img_url: null,
							},
						],
						error: null,
					}),
				}),
			};
		}
		return {
			select: selectChain,
			insert: () => insertChain,
			delete: () => deleteChain,
		};
	});

	return { supabase: { from } };
});

// Mock DB service modules that also use supabase
vi.mock('../src/services/addOrgWishlist.js', () => ({
	addOrg: vi.fn().mockResolvedValue([
		{
			id: 99,
			name: 'Test Co',
			city: 'London',
			country: 'UK',
			industry: 'Tech',
			description: 'A test company',
			size: '1-50',
			img_url: null,
		},
	]),
}));

vi.mock('../src/services/addRelationshipUserOrg.js', () => ({
	addRelationshipUserOrg: vi
		.fn()
		.mockResolvedValue([
			{ user_fk: 1, wishlist_fk: 99, wishlisted_rejected: 'wishlisted' },
		]),
}));

vi.mock('../src/services/deleteRelationshipUserOrg.js', () => ({
	deleteRelationshipUserOrg: vi
		.fn()
		.mockResolvedValue({ success: true, deletedCount: 1 }),
}));

vi.mock('../src/services/getOrgsByUser.js', () => ({
	getOrgsByUser: vi.fn().mockResolvedValue([]),
}));

describe('Wishlist API', () => {
	it('GET /api/wishlist should return empty wishlist when user has no entries', async () => {
		const res = await request(app).get('/api/wishlist').expect(200);
		expect(res.body.success).toBe(false);
		expect(res.body.message).toBe('empty wishlist');
	});

	it('POST /api/wishlist should add a new company', async () => {
		const newCompany = {
			name: 'Test Co',
			industry: 'Tech',
			size: '1-50',
			city: 'London',
			country: 'UK',
			description: 'A test company',
			websiteUrl: 'https://testco.com',
		};

		const res = await request(app)
			.post('/api/wishlist')
			.send(newCompany)
			.expect(200);

		expect(res.body.success).toBe(true);
		expect(res.body.company.name).toBe('Test Co');
	});

	it('POST /api/wishlist should fail when required fields are missing', async () => {
		const res = await request(app)
			.post('/api/wishlist')
			.send({ name: 'Incomplete Co' })
			.expect(400);

		expect(res.body.success).toBe(false);
		expect(res.body.message).toBe('Missing required company fields');
	});

	it('DELETE /api/wishlist should return 404 when company not found', async () => {
		const res = await request(app)
			.delete('/api/wishlist')
			.query({ name: 'NotFound' })
			.expect(404);

		expect(res.body.success).toBe(false);
		expect(res.body.message).toBe('Company not in wishlist');
	});

	it('DELETE /api/wishlist should return 400 when name is missing', async () => {
		const res = await request(app).delete('/api/wishlist').expect(400);

		expect(res.body.success).toBe(false);
		expect(res.body.message).toBe('Company name is required');
	});
});
