const http = require('http');
const app = require('./app');
const config = require('./utils/config');
const logger = require('./utils/logger');

const server = http.createServer(app);

const { PORT } = config;
server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`URL: http://localhost:${PORT}`);
  logger.info(`Running environment: ${config.NODE_ENV}`);
});
