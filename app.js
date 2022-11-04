const express = require('express');
require('express-async-errors');

const app = express();

const cors = require('cors');
const morgan = require('morgan');
const middleware = require('./utils/middleware');
const logger = require('./utils/logger');

app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));

app.get('/api/ping', (request, response) => {
  response.send('<p>pong</p>');
});

app.get('/api/failping', (request, response) => {
  response.status(400).send();
});

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
