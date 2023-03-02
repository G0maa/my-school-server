import express from 'express';
require('express-async-errors');

import cors from 'cors';
import morgan from 'morgan';
import passport from 'passport';
import session from 'express-session';

import { connectToDatabase } from './utils/db';
import init from './utils/init';

import config from './utils/config';
import { unknownEndpoint, errorHandler } from './utils/middleware';

import devRouter from './controllers/dev';
import loginRouter from './controllers/auth';
import studentRouter from './controllers/student';
import teacherRouter from './controllers/teacher';
import { requestLogger } from './utils/middleware';
import subjectRouter from './controllers/subject';
import studyClassRouter from './controllers/studyClass';
import activeSubjectRouter from './controllers/activeSubject';
import subjectMaterialRouter from './controllers/subjectsMaterial';
import holidayRouter from './controllers/holiday';
import feeRouter from './controllers/fee';
import gradeRouter from './controllers/grade';
import userRouter from './controllers/user';
import startSwagger from './utils/swagger';
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
if (config.NODE_ENV === 'DEV') app.use(requestLogger);
app.use(morgan('tiny'));

if (config.NODE_ENV !== 'PROD') app.use('/', devRouter);

// Might need to get rid of trailing dashes here To-Do
app.use('/api/auth/', loginRouter);
app.use('/api/student/', studentRouter);
app.use('/api/teacher/', teacherRouter);
app.use('/api/subject/', subjectRouter);
app.use('/api/studyClass/', studyClassRouter);
app.use('/api/activeSubject/', activeSubjectRouter);
app.use('/api/subjectsMaterial/', subjectMaterialRouter);
app.use('/api/holiday/', holidayRouter);
app.use('/api/fee/', feeRouter);
app.use('/api/grade/', gradeRouter);
app.use('/api/user/', userRouter);

app.get('/api/ping', (_, response) => {
  response.send('<p>pong</p>');
});

app.get('/api/failping', (_, response) => {
  response.status(400).send();
});

const initServer = async () => {
  await startSwagger(app);
  await connectToDatabase();
  await init();

  // should be outside of this function, hopefully only temporary.
  app.use(unknownEndpoint);
  app.use(errorHandler);
};

export { app, initServer };
