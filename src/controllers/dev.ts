/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express';
import { Student } from '../models';
import { isAuthenticated } from '../utils/middleware';
const devRouter = express.Router();

devRouter.get('/deleteAllRecords', async (_req, res) => {
  await Student.destroy({ where: {} });
  return res.status(200).end();
});

// try auth middleware here.
devRouter.get('/testAuth', isAuthenticated, (req, res) => {
  return res.status(200).json(req.user).end();
});

devRouter.get('/testUnAuth', (_req, res) => {
  return res.status(200).json({ message: 'Authorized /testUnAuth' }).end();
});

export default devRouter;
