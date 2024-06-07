import { prismaClient } from '../application/database.js';

const getAll = async () => {
	const books = await prismaClient.book.findMany({
		where: {
			stock: {
				gt: 0,
			},
		},
		orderBy: { id: 'asc' },
	});
	return books;
};

export default { getAll };
