import express from 'express';
import { router } from '../routes/api.js';
import { errorMiddleware } from '../middleware/error-middleware.js';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
export const web = express();
const swaggerJson = JSON.parse(
	fs.readFileSync(`${path.resolve()}/src/docs/swagger-output.json`)
);

web.use(express.json());
web.use(router);
web.use(errorMiddleware);
web.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJson));
web.use((req, res, next) => {
	res.status(404).json({ errors: 'Not found' });
});
