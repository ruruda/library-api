import memberService from '../service/member-service.js';

const get = async (req, res, next) => {
	try {
		const result = await memberService.get();
		res.status(200).json({
			data: result,
		});
	} catch (error) {
		next(error);
	}
};

const borrowBook = async (req, res, next) => {
	try {
		const result = await memberService.borrowBook(req.body);
		res.status(200).json({ data: result });
	} catch (error) {
		next(error);
	}
};

const returnBook = async (req, res, next) => {
	try {
		const result = await memberService.returnBook(req.body);
		res.status(200).json({ data: result });
	} catch (error) {
		next(error);
	}
};

export default {
	get,
	borrowBook,
	returnBook,
};
