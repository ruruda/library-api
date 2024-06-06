import supertest from 'supertest';
import { web } from '../application/web.js';

describe('GET /api/books', () => {
	it('should get all books with stock and not borrowed', async () => {
		const result = await supertest(web).get('/api/books');

		expect(result.statusCode).toBe(200);
		result.body.data.forEach((book) => {
			expect(book.stock).toBeGreaterThan(0);
			expect(book.borrow.length).toBe(0);
		});
	});
});
