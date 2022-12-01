import http from 'http';
import app from './app';
import config from './utils/config';
import { connectToDatabase } from './utils/db';
import logger from './utils/logger';

const server = http.createServer(app);

const start = async () => {
  // Here, or in app.ts?
  await connectToDatabase();

  server.listen(config.PORT, () => {
    logger.info(`Server running on port ${config.PORT}`);
    logger.info(`URL: http://localhost:${config.PORT}`);
    logger.info(`Running environment: ${config.NODE_ENV}`);
  });
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
start();
