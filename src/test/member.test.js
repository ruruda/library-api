import supertest from 'supertest';
import { web } from '../application/web.js';
import {
	createBorrowsBook,
	createPenalty,
	removeBorrows,
	removePenalty,
	updateBookStock,
} from './test-util.js';
import memberService from '../service/member-service.js';

describe('POST /api/members/borrows', () => {
	afterEach(async () => {
		await removeBorrows();
		await updateBookStock();
		await removePenalty();
	});

	it('should can borrow book', async () => {
		const result = await supertest(web).post('/api/members/borrows').send({
			memberCode: 'M001',
			bookCode: 'JK-45',
		});

		expect(result.statusCode).toBe(200);
		expect(result.body.data.member.code).toBe('M001');
		expect(result.body.data.book.code).toBe('JK-45');
	});

	it('should reject borrow book if member not found', async () => {
		const result = await supertest(web).post('/api/members/borrows').send({
			memberCode: 'M00B',
			bookCode: 'JK-45',
		});

		expect(result.statusCode).toBe(404);
		expect(result.body.errors).toBe('Member not found');
	});

	it('should reject borrow book if book not found', async () => {
		const result = await supertest(web).post('/api/members/borrows').send({
			memberCode: 'M001',
			bookCode: 'JK-00',
		});

		expect(result.statusCode).toBe(404);
		expect(result.body.errors).toBe('Book not found');
	});

	it('should reject borrow book if member already borrowed 2 books', async () => {
		await createBorrowsBook();

		const result = await supertest(web).post('/api/members/borrows').send({
			memberCode: 'M001',
			bookCode: 'TW-11',
		});

		expect(result.statusCode).toBe(400);
		expect(result.body.errors).toBe('Member cannot borrow more than 2 books');
	});

	it('should reject borrow book if member is currently being penalized', async () => {
		const endDate = new Date(new Date());
		endDate.setDate(endDate.getDate() + 3);
		await createPenalty(endDate);

		const result = await supertest(web).post('/api/members/borrows').send({
			memberCode: 'M001',
			bookCode: 'JK-45',
		});

		expect(result.statusCode).toBe(400);
		expect(result.body.errors).toBe('Member is currently being penalized');
	});
});

describe('GET /api/members', () => {
	afterEach(async () => {
		await removeBorrows();
		await updateBookStock();
	});

	it('should get all members with number of borrowed', async () => {
		await supertest(web).post('/api/members/borrows').send({
			memberCode: 'M001',
			bookCode: 'JK-45',
		});

		const result = await supertest(web).get('/api/members');

		expect(result.statusCode).toBe(200);
		expect(result.body.data.length).toBe(3);
		expect(result.body.data[0].borrowedCount).toBe(1);
		expect(result.body.data[1].borrowedCount).toBe(0);
	});
});
