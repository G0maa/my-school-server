import http from 'http';
import app from './app';
import config from './utils/config';
import logger from './utils/logger';

const server = http.createServer(app);

const { PORT } = config;
server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`URL: http://localhost:${PORT}`);
  logger.info(`Running environment: ${config.NODE_ENV}`);
});
