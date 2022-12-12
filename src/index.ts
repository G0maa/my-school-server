import http from 'http';
import app from './app';
import config from './utils/config';
import logger from './utils/logger';

const server = http.createServer(app);

server.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
  logger.info(`URL: http://localhost:${config.PORT}`);
  logger.info(`Running environment: ${config.NODE_ENV}`);
});
