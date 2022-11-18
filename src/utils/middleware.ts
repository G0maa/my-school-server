// See: https://stackoverflow.com/a/64353755
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { ErrorRequestHandler, Request, Response } from 'express';
import logger from './logger';

const unknownEndpoint = (_req: Request, res: Response) => {
  res.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler: ErrorRequestHandler = (error, _request, response, next) => {
  logger.error('error name', error.name);
  logger.error(error.message);

  // just example so I remember
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  }
  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }

  return next(error);
};

export default {
  unknownEndpoint,
  errorHandler,
};
