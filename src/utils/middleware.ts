// See: https://stackoverflow.com/a/64353755
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type {
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from 'express';
import { AnyZodObject } from 'zod';
import jwt from 'jsonwebtoken';
import { Role } from '../validator/general.validator';
import logger from './logger';
import config from './config';

const requestLogger = (req: Request, _res: Response, next: NextFunction) => {
  logger.info('Method:', req.method);
  logger.info('Path:  ', req.path);
  logger.info('Body:  ', req.body);
  logger.info('---');
  next();
};

const setAuthorizedRoles = (allowedRoles: Role[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    req.allowedRoles = allowedRoles;
    return next();
  };
};

// and authorized.
const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.get('authorization');

  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    const token = authorization.substring(7);
    req.user = jwt.verify(token, config.SECRET) as Express.User;
  } else {
    return res.status(401).json({ message: 'Missing Token' });
  }

  if (!req.user)
    return res.status(401).json({ message: 'Invalid Token' }).end();

  // Every authenticated user is allowed to use this route.
  if (!req.allowedRoles) return next();

  const isAuthorized = req.allowedRoles.find((role) => req.user?.role === role);

  if (!isAuthorized)
    return res.status(401).json({ message: 'Unauthorized User' }).end();

  return next();
};

// To try this middleware
const validate =
  (schema: AnyZodObject) =>
  (req: Request, _res: Response, next: NextFunction) => {
    // Error handling in errror-handler middleware
    // await/promise is needed only if you use **async** `refinements` or `transformers`
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    return next();
  };

const unknownEndpoint = (_req: Request, res: Response) => {
  res.status(404).send({ error: 'unknown endpoint' });
};

// Errors probably need to be typed, also it's pretty WET code.
const errorHandler: ErrorRequestHandler = (error, _request, response, next) => {
  logger.error('Error name: ', error.name);
  logger.error('Error message: ', error.message);
  logger.error('Error object: ', error);

  // just example so I remember
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  }
  if (error.name === 'ValidationError') {
    return response.status(400).json({ error });
  }
  if (error.name === 'ZodError') {
    return response.status(400).json(error.message);
  }
  if (error.name === 'SequelizeDatabaseError') {
    return response.status(400).json(error.errors);
  }
  if (error.name === 'SequelizeValidationError') {
    return response.status(400).json(error.errors);
  }
  if (error.name === 'SequelizeForeignKeyConstraintError') {
    return response.status(400).json(error.message);
  }
  if (error.name === 'SequelizeUniqueConstraintError') {
    return response.status(400).json(error.message);
  }
  return next(error);
};

export {
  unknownEndpoint,
  errorHandler,
  isAuthenticated,
  setAuthorizedRoles,
  validate,
  requestLogger,
};
