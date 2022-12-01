import express from 'express';
require('express-async-errors');

const app = express();

import cors from 'cors';
import morgan from 'morgan';
import middleware from './utils/middleware';

app.use(cors());
app.use(express.json());

// Unsure about the cause of this...
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
app.use(morgan('tiny'));

app.get('/api/ping', (_, response) => {
  response.send('<p>pong</p>');
});

app.get('/api/failping', (_, response) => {
  response.status(400).send();
});

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

export default app;
