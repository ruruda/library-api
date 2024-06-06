import bookService from '../service/book-service.js';

const getAll = async (req, res, next) => {
	try {
		const result = await bookService.getAll();
		res.status(200).json({ data: result });
	} catch (error) {
		next(error);
	}
};

export default { getAll };
