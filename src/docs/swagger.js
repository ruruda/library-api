import swaggerAutogen from 'swagger-autogen';

const doc = {
	info: {
		title: 'Library API',
		description: 'Library API',
	},
	host: 'localhost:8000',
};

const outputFile = './src/docs/swagger-output.json';
const routes = ['./src/routes/api.js'];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen()(outputFile, routes, doc);
