import express from 'express';
import memberController from '../controller/member-controller.js';
import bookController from '../controller/book-controller.js';

const router = express.Router();

router.get('/api/members', memberController.get);
router.post('/api/members/borrows', memberController.borrowBook);
router.post('/api/members/return', memberController.returnBook);

router.get('/api/books', bookController.getAll);

export { router };
