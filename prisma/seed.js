import { prismaClient } from '../src/application/database.js';

const main = async () => {
	await prismaClient.book.createMany({
		data: [
			{
				code: 'JK-45',
				title: 'Harry Potter',
				author: 'J.K Rowling',
				stock: 1,
			},
			{
				code: 'SHR-1',
				title: 'A Study in Scarlet',
				author: 'Arthur Conan Doyle',
				stock: 1,
			},
			{
				code: 'TW-11',
				title: 'Twilight',
				author: 'Stephenie Meyer',
				stock: 1,
			},
			{
				code: 'HOB-83',
				title: 'The Hobbit, or There and Back Again',
				author: 'J.R.R. Tolkien',
				stock: 1,
			},
			{
				code: 'NRN-7',
				title: 'The Lion, the Witch and the Wardrobe',
				author: 'C.S. Lewis',
				stock: 1,
			},
		],
	});

	await prismaClient.member.createMany({
		data: [
			{
				code: 'M001',
				name: 'Angga',
			},
			{
				code: 'M002',
				name: 'Ferry',
			},
			{
				code: 'M003',
				name: 'Putri',
			},
		],
	});
};

main()
	.then(async () => {
		await prismaClient.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prismaClient.$disconnect();
		process.exit(1);
	});
