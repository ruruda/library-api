import { prismaClient } from '../application/database.js';

const getAll = async () => {
	const books = await prismaClient.book.findMany({
		where: {
			borrow: { none: {} },
		},
		include: {
			borrow: true,
		},
	});
	return books;
};

export default { getAll };
