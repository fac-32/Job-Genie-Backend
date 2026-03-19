import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

// Mock requireAuth to inject a fake user (required by app-level middleware for /api/companies)
vi.mock('../src/middleware/requireAuth.js', () => ({
	requireAuth: (req: any, _res: any, next: any) => {
		req.user = { id: 'test-uuid' };
		next();
	},
}));

// DummyApiService uses only static in-memory data — no external mocking needed

describe('Companies API', () => {
	describe('GET /api/companies/:companyName/overview', () => {
		it('returns 200 with company and jobs for a known company', async () => {
			const res = await request(app)
				.get('/api/companies/google/overview')
				.expect(200);

			expect(res.body.success).toBe(true);
			expect(res.body.data.company).toBeDefined();
			expect(Array.isArray(res.body.data.jobs)).toBe(true);
		});

		it('returns 500 for an unknown company', async () => {
			const res = await request(app)
				.get('/api/companies/unknown/overview')
				.expect(500);

			expect(res.body.success).toBe(false);
		});
	});

	describe('GET /api/companies/:companyName/jobs', () => {
		it('returns 200 with jobs array for a known company', async () => {
			const res = await request(app)
				.get('/api/companies/google/jobs')
				.expect(200);

			expect(res.body.success).toBe(true);
			expect(Array.isArray(res.body.data)).toBe(true);
			expect(res.body.data.length).toBeGreaterThan(0);
		});
	});

	describe('GET /api/companies/:companyName/jobs/:jobId', () => {
		it('returns 200 with job details for a known job id', async () => {
			const res = await request(app)
				.get('/api/companies/google/jobs/google-1')
				.expect(200);

			expect(res.body.success).toBe(true);
			expect(res.body.data).toBeDefined();
		});

		it('returns 500 for a nonexistent job id', async () => {
			const res = await request(app)
				.get('/api/companies/google/jobs/nonexistent')
				.expect(500);

			expect(res.body.success).toBe(false);
		});
	});
});
