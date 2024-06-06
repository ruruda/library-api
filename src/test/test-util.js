import { prismaClient } from '../application/database';

export const removeBorrows = async () => {
	return prismaClient.borrow.deleteMany();
};

export const updateBookStock = async () => {
	return prismaClient.book.updateMany({
		where: { stock: 0 },
		data: { stock: 1 },
	});
};

export const removePenalty = async () => {
	return prismaClient.penalty.deleteMany();
};

export const createBorrowsBook = async () => {
	return prismaClient.borrow.createMany({
		data: [
			{ memberId: 1, bookId: 1 },
			{ memberId: 1, bookId: 2 },
		],
	});
};

export const createPenalty = async (endDate) => {
	return prismaClient.penalty.create({
		data: {
			memberId: 1,
			startDate: new Date(),
			endDate: endDate,
		},
	});
};
