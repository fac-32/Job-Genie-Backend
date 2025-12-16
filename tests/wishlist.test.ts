import { describe, it, beforeEach, expect } from 'vitest';
import request from 'supertest';
import app from '../src/server'; // your Express app
import { userWishlist } from '../src/controllers/wishlist.controller';

// Reset the in-memory wishlist before each test
beforeEach(() => {
	userWishlist.length = 0;
});

describe('Wishlist API', () => {
	it('GET /wishlist should return empty wishlist initially', async () => {
		const res = await request(app).get('/wishlist').expect(200);
		expect(res.body.success).toBe(false);
		expect(res.body.message).toBe('empty wishlist');
	});

	it('POST /wishlist should add a new company', async () => {
		const newCompany = {
			name: 'Test Co',
			industry: 'Tech',
			size: '100-500',
			city: 'London',
			country: 'UK',
			description: 'A test company',
			websiteUrl: 'https://testco.com',
		};

		const res = await request(app)
			.post('/wishlist')
			.send(newCompany)
			.expect(200);

		expect(res.body.success).toBe(true);
		expect(res.body.total).toBe(1);
		expect(res.body.companies[0].name).toBe('Test Co');
	});

	it('POST /wishlist should fail when required fields are missing', async () => {
		const res = await request(app)
			.post('/wishlist')
			.send({ name: 'Incomplete Co' })
			.expect(400);

		expect(res.body.success).toBe(false);
		expect(res.body.message).toBe('Missing required company fields');
	});

	it('POST /wishlist should fail if company already exists', async () => {
		const company = {
			name: 'Duplicate Co',
			industry: 'Tech',
			size: '50-100',
			city: 'NYC',
			country: 'USA',
			description: 'Duplicate test',
			websiteUrl: 'https://duplicate.com',
		};

		// Add it first time
		await request(app).post('/wishlist').send(company).expect(200);

		// Try adding again
		const res = await request(app).post('/wishlist').send(company).expect(409);

		expect(res.body.success).toBe(false);
		expect(res.body.message).toBe('Company already exists in wishlist');
	});

	it('DELETE /wishlist should remove a company', async () => {
		const company = {
			name: 'Delete Me',
			industry: 'Tech',
			size: '10-50',
			city: 'Berlin',
			country: 'Germany',
			description: 'To be deleted',
			websiteUrl: 'https://delete.com',
		};

		await request(app).post('/wishlist').send(company).expect(200);

		const res = await request(app)
			.delete('/wishlist')
			.query({ name: 'Delete Me' })
			.expect(200);

		expect(res.body.success).toBe(true);
		expect(res.body.deleted.name).toBe('Delete Me');
		expect(res.body.total).toBe(0);
	});

	it('DELETE /wishlist should fail if company not found', async () => {
		const res = await request(app)
			.delete('/wishlist')
			.query({ name: 'NotFound' })
			.expect(404);

		expect(res.body.success).toBe(false);
		expect(res.body.message).toBe('Company not in wishlist');
	});
});
