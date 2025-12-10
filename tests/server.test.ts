// backend/tests/server.test.ts

import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

/**
 * Basic server integration tests
 * TODO: Add more comprehensive tests as the application grows
 */

describe('Server Health Check', () => {
	it('should return 200 OK on /health endpoint', async () => {
		const response = await request(app).get('/health');

		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty('status', 'ok');
	});

	it('should return welcome message on root endpoint', async () => {
		const response = await request(app).get('/');

		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty('message');
	});
});

describe('404 Handler', () => {
	it('should return 404 for unknown routes', async () => {
		const response = await request(app).get('/api/unknown-route');

		expect(response.status).toBe(404);
		expect(response.body).toHaveProperty('error');
	});
});
