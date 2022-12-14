import http from 'http';
import { app, initServer } from './app';
import config from './utils/config';
import logger from './utils/logger';

const server = http.createServer(app);

const start = async () => {
  await initServer();
  server.listen(config.PORT, () => {
    logger.info(`Server running on port ${config.PORT}`);
    logger.info(`URL: http://localhost:${config.PORT}`);
    logger.info(`Running environment: ${config.NODE_ENV}`);
  });
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
start();
