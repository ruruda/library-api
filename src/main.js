import { logger } from './application/logging.js';
import { web } from './application/web.js';

web.listen(8000, () => {
	logger.info('Server is listening at http://localhost:8000');
});
