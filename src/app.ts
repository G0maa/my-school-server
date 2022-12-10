import express from 'express';
require('express-async-errors');

import cors from 'cors';
import morgan from 'morgan';
import passport from 'passport';
import session from 'express-session';
import config from './utils/config';
import { unknownEndpoint, errorHandler } from './utils/middleware';

import devRouter from './controllers/dev';
import loginRouter from './controllers/auth';
import studentRouter from './controllers/student';
// import logger from './utils/logger';

const app = express();

app.use(
  session({
    secret: config.SECRET,
    resave: false,
    saveUninitialized: false,
    // store: new MemoryStore(),
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30, // 1  month
      sameSite: true,
    },
  })
);

// This makes passport 'deserializeUser' work on session.
app.use(passport.authenticate('session'));

app.use(
  cors({
    origin: 'http://localhost:4200',
    credentials: true,
  })
);
app.use(express.json());

// Unsure about the cause of this...
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
app.use(morgan('tiny'));

if (config.NODE_ENV !== 'PROD') app.use('/', devRouter);

app.use('/api/auth/', loginRouter);
app.use('/api/student/', studentRouter);

app.get('/api/ping', (_, response) => {
  response.send('<p>pong</p>');
});

app.get('/api/failping', (_, response) => {
  response.status(400).send();
});

app.use(unknownEndpoint);
app.use(errorHandler);

export default app;
