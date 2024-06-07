import { prismaClient } from '../application/database.js';
import { ResponseError } from '../error/response-error.js';

const get = async () => {
	const members = await prismaClient.member.findMany({
		include: {
			borrow: {
				where: {
					returnDate: null,
				},
			},
			penalty: true,
		},
	});

	const membersWithBorrowCount = members.map((member) => ({
		...member,
		borrowedCount: member.borrow.length,
	}));

	return membersWithBorrowCount;
};

const borrowBook = async (request) => {
	if (!request.memberCode || !request.bookCode) {
		throw new ResponseError(400, 'Please provide memberCode and bookCode');
	}
	const transaction = await prismaClient.$transaction(async (prisma) => {
		const member = await prisma.member.findUnique({
			where: {
				code: request.memberCode,
			},
			include: {
				borrow: {
					where: { returnDate: null },
				},
				penalty: true,
			},
		});

		if (!member) {
			throw new ResponseError(404, 'Member not found');
		}

		if (member.borrow.length >= 2) {
			throw new ResponseError(400, 'Member cannot borrow more than 2 books');
		}

		if (member.penalty !== null) {
			const now = new Date();
			const penaltyEnd = member.penalty.endDate;

			if (now < penaltyEnd) {
				throw new ResponseError(400, 'Member is currently being penalized');
			}

			await prisma.penalty.delete({
				where: {
					id: member.penalty.id,
				},
			});
		}

		const book = await prisma.book.findUnique({
			where: { code: request.bookCode },
			include: {
				borrow: true,
			},
		});

		if (!book) {
			throw new ResponseError(404, 'Book not found');
		}

		if (book.stock < 1) {
			throw new ResponseError(400, 'Book already borrowed by another member');
		}

		const borrow = await prisma.borrow.create({
			data: {
				memberId: member.id,
				bookId: book.id,
			},
			include: {
				member: true,
				book: true,
			},
		});

		await prisma.book.update({
			where: { code: request.bookCode },
			data: {
				stock: book.stock - 1,
			},
		});

		return borrow;
	});

	return transaction;
};

const returnBook = async (request) => {
	if (!request.memberCode || !request.bookCode) {
		throw new ResponseError(400, 'Please provide memberCode and bookCode');
	}
	const transaction = await prismaClient.$transaction(async (prisma) => {
		const member = await prisma.member.findUnique({
			where: {
				code: request.memberCode,
			},
		});

		if (!member) {
			throw new ResponseError(404, 'Member not found');
		}

		const memberId = member.id;

		const book = await prisma.book.findUnique({
			where: { code: request.bookCode },
		});

		if (!book) {
			throw new ResponseError(404, 'Book not found');
		}

		const bookId = book.id;

		const borrow = await prisma.borrow.findFirst({
			where: {
				memberId: memberId,
				bookId: bookId,
				returnDate: null,
			},
		});

		if (!borrow) {
			throw new ResponseError(404, 'This book is not borrowed by this member');
		}

		const now = new Date();
		const borrowDate = new Date(borrow.borrowDate);
		const diffDays = Math.ceil(Math.abs(now - borrowDate) / (1000 * 60 * 60 * 24));

		const updateBorrow = await prisma.borrow.update({
			where: {
				id: borrow.id,
			},
			data: { returnDate: now },
			include: {
				member: true,
				book: true,
			},
		});

		await prisma.book.update({
			where: { code: request.bookCode },
			data: { stock: book.stock + 1 },
		});

		let penalty;

		if (diffDays > 7) {
			penalty = await prisma.penalty.findUnique({
				where: {
					memberId: memberId,
				},
			});

			if (penalty) {
				await prisma.penalty.delete({
					where: {
						id: penalty.id,
					},
				});
			}

			const endDate = new Date(now);
			endDate.setDate(endDate.getDate() + 3);

			penalty = await prisma.penalty.create({
				data: {
					memberId: memberId,
					startDate: now,
					endDate: endDate,
				},
			});
		}
		return { updateBorrow, penalty };
	});
	return transaction;
};

export default {
	get,
	borrowBook,
	returnBook,
};
