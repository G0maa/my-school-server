// See: https://stackoverflow.com/a/64353755
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type {
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from 'express';
import multer from 'multer';
import path from 'path';
import { AnyZodObject } from 'zod';
import { Role } from '../validator/general.validator';
import logger from './logger';

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
  if (!req.user)
    return res.status(401).json({ message: 'Unauthenticed User' }).end();

  // Every authenticated user is allowed to use this route.
  if (!req.allowedRoles) return next();

  const isAuthorized = req.allowedRoles.find((role) => req.user?.role === role);

  if (!isAuthorized)
    return res.status(401).json({ message: 'Unauthorized User' }).end();

  return next();
};

// **Assumes nested style of API** => /api/student/:studentId/fee/:feeId
// https://stackoverflow.com/questions/3297048/403-forbidden-vs-401-unauthorized-http-responses
const isAuthenticatedTest = (idAttributeName?: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // I. Is Authenticated? i.e. does the client have auth data in the session?
    if (!req.user)
      return res.status(401).json({ message: 'Unauthenticed User' }).end();

    // II. Is Authorized?
    // A. Is Admin?

    if (req.user.role === 'Admin') return next();

    if (!req.allowedRoles) return next();

    // B. Is non-admin but allowed?
    const isAuthorized = req.allowedRoles.find(
      (role) => req.user?.role === role
    );

    if (!isAuthorized)
      return res.status(403).json({ message: 'Unauthorized User' }).end();

    // C. Does the client own the requested resource?
    if (idAttributeName && req.user.id !== req.params[idAttributeName])
      return res.status(403).json({ message: 'Unauthorized User' }).end();

    return next();
  };
};

// To try this middleware
const validateSchema =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    // Error handling in errror-handler middleware
    // await/promise is needed only if you use **async** `refinements` or `transformers`
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      console.log('Errors: ', e.errors);
      return res.status(400).send(e.errors);
    }
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

const storage = multer.diskStorage({
  destination: function (_req, _file, callback) {
    callback(null, 'uploads/temp/');
  },
  // to-do add random number in-case file already exists.
  filename: function (_req, file, callback) {
    callback(null, file.originalname);
  },
});

const uploadFile = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    const fileExtension = path.extname(file.originalname);

    if (
      fileExtension === '.pdf' ||
      fileExtension === '.jpg' ||
      fileExtension === '.png' ||
      fileExtension === '.txt'
    ) {
      cb(null, true);
    }
    cb(null, false);
  },
  limits: { fileSize: 10 * 1048576 }, // 10MB
});

export {
  unknownEndpoint,
  errorHandler,
  isAuthenticated,
  setAuthorizedRoles,
  validateSchema,
  requestLogger,
  uploadFile,
  isAuthenticatedTest,
};
