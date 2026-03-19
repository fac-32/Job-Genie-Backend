import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

const mockFetchTheirStackJobs = vi.hoisted(() => vi.fn());

// Mock requireAuth to inject a fake user (required by app-level middleware for /jobs)
vi.mock('../src/middleware/requireAuth.js', () => ({
	requireAuth: (req: any, _res: any, next: any) => {
		req.user = { id: 'test-uuid' };
		next();
	},
}));

// Mock TheirStack service to avoid real HTTP calls
vi.mock('../src/services/theirStack.js', () => ({
	fetchTheirStackJobs: mockFetchTheirStackJobs,
}));

// Mock supabase for the DB-wishlist fallback path in getCompaniesFromDB
vi.mock('../src/config/supabase.js', () => ({
	supabase: {
		auth: {
			signUp: vi.fn(),
			signInWithPassword: vi.fn(),
			signInWithIdToken: vi.fn(),
		},
		from: vi.fn((table: string) => {
			if (table === 'Users') {
				return {
					select: () => ({
						eq: () => ({
							single: () => ({ data: { id: 1 }, error: null }),
						}),
					}),
				};
			}
			if (table === 'Wishlist') {
				return {
					select: () => ({
						in: () => ({ data: [], error: null }),
					}),
				};
			}
			return {};
		}),
	},
}));

// Mock getOrgsByUser to return empty array (no wishlist in DB)
vi.mock('../src/services/getOrgsByUser.js', () => ({
	getOrgsByUser: vi.fn().mockResolvedValue([]),
}));

describe('Jobs API', () => {
	it('POST /jobs with companies in body returns 200', async () => {
		mockFetchTheirStackJobs.mockResolvedValue([]);

		const res = await request(app)
			.post('/jobs')
			.send({
				companies: [
					{
						name: 'TestCo',
						industry: 'Tech',
						size: '10-50',
						city: 'London',
						country: 'UK',
						description: 'A test company',
					},
				],
			})
			.expect(200);

		expect(res.body.success).toBe(true);
		expect(Array.isArray(res.body.results)).toBe(true);
	});

	it('POST /jobs with no companies and empty DB wishlist returns 400', async () => {
		const res = await request(app).post('/jobs').send({}).expect(400);

		expect(res.body.success).toBe(false);
		expect(res.body.message).toBe('No companies available in wishlist');
	});

	it('POST /jobs returns 500 when TheirStack throws', async () => {
		mockFetchTheirStackJobs.mockRejectedValue(new Error('TheirStack down'));

		const res = await request(app)
			.post('/jobs')
			.send({
				companies: [
					{
						name: 'TestCo',
						industry: 'Tech',
						size: '10-50',
						city: 'London',
						country: 'UK',
						description: 'A test company',
					},
				],
			})
			.expect(500);

		expect(res.body.success).toBe(false);
	});
});
