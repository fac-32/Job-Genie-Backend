import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

// Hoisted mock refs so they're accessible both inside vi.mock and in tests
const mockSignUp = vi.hoisted(() => vi.fn());
const mockSignInWithPassword = vi.hoisted(() => vi.fn());
const mockSignInWithIdToken = vi.hoisted(() => vi.fn());

// Mock requireAuth to inject a fake user (for /auth/me)
vi.mock('../src/middleware/requireAuth.js', () => ({
	requireAuth: (req: any, _res: any, next: any) => {
		req.user = { id: 'test-uuid', email: 'test@test.com' };
		next();
	},
}));

// Mock supabase auth methods and Users table lookup
vi.mock('../src/config/supabase.js', () => ({
	supabase: {
		auth: {
			signUp: mockSignUp,
			signInWithPassword: mockSignInWithPassword,
			signInWithIdToken: mockSignInWithIdToken,
		},
		from: vi.fn((table: string) => {
			if (table === 'Users') {
				return {
					select: () => ({
						eq: () => ({
							single: () => ({ data: null, error: { message: 'not found' } }),
						}),
					}),
					insert: () => ({
						select: () => ({ data: [{ id: 1 }], error: null }),
					}),
				};
			}
			return {};
		}),
	},
}));

// Mock google-auth-library so verifyIdToken throws by default (invalid token scenario).
// Must use a class or regular function — arrow functions can't be used as constructors.
vi.mock('google-auth-library', () => {
	class MockOAuth2Client {
		verifyIdToken = vi
			.fn()
			.mockRejectedValue(new Error('Token verification failed'));
	}
	return { OAuth2Client: MockOAuth2Client };
});

// Mock global fetch for the logout revocation call
global.fetch = vi.fn().mockResolvedValue({ ok: true, status: 200 });

describe('Auth API', () => {
	describe('POST /auth/signup', () => {
		it('returns 200 with success:true on valid body', async () => {
			mockSignUp.mockResolvedValueOnce({
				data: {
					user: { id: 'u1', email: 'test@test.com' },
					session: null,
				},
				error: null,
			});

			const res = await request(app)
				.post('/auth/signup')
				.send({
					email: 'test@test.com',
					password: 'pass123',
					name: 'Test User',
					phone: '123',
				})
				.expect(200);

			expect(res.body.success).toBe(true);
		});

		it('returns 400 with success:false when Supabase returns error', async () => {
			mockSignUp.mockResolvedValueOnce({
				data: null,
				error: { message: 'Email already registered' },
			});

			const res = await request(app)
				.post('/auth/signup')
				.send({
					email: 'taken@test.com',
					password: 'pass123',
					name: 'Test User',
					phone: '123',
				})
				.expect(400);

			expect(res.body.success).toBe(false);
		});
	});

	describe('POST /auth/login', () => {
		it('returns 200 with success:true and sets sb_token cookie on valid credentials', async () => {
			mockSignInWithPassword.mockResolvedValueOnce({
				data: {
					session: { access_token: 'tok123' },
					user: {
						id: 'u1',
						email: 'test@test.com',
						user_metadata: {},
					},
				},
				error: null,
			});

			const res = await request(app)
				.post('/auth/login')
				.send({ email: 'test@test.com', password: 'pass123' })
				.expect(200);

			expect(res.body.success).toBe(true);
			const cookies = res.headers['set-cookie'] as string[];
			expect(cookies.some((c: string) => c.startsWith('sb_token='))).toBe(true);
		});

		it('returns 400 with message on wrong password', async () => {
			mockSignInWithPassword.mockResolvedValueOnce({
				data: null,
				error: { message: 'Invalid login credentials' },
			});

			const res = await request(app)
				.post('/auth/login')
				.send({ email: 'test@test.com', password: 'wrong' })
				.expect(400);

			expect(res.body.message).toBeDefined();
		});
	});

	describe('POST /auth/logout', () => {
		it('returns 200 and success:true when sb_token cookie is present', async () => {
			const res = await request(app)
				.post('/auth/logout')
				.set('Cookie', 'sb_token=sometoken')
				.expect(200);

			expect(res.body.success).toBe(true);
		});

		it('returns 200 and success:true even when no cookie present', async () => {
			const res = await request(app).post('/auth/logout').expect(200);

			expect(res.body.success).toBe(true);
		});
	});

	describe('POST /auth/me', () => {
		it('returns 200 and echoes injected user when authenticated', async () => {
			const res = await request(app).post('/auth/me').expect(200);

			expect(res.body.success).toBe(true);
			expect(res.body.id).toBe('test-uuid');
		});
	});

	describe('POST /auth/google', () => {
		it('returns 401 when token is invalid', async () => {
			const res = await request(app)
				.post('/auth/google')
				.send({ token: 'bad-token' })
				.expect(401);

			expect(res.body.ok).toBe(false);
		});
	});
});
