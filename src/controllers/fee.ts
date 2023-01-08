/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { Request, Response } from 'express';
import {
  createFee,
  deleteFee,
  getFee,
  getFees,
  updateFee,
} from '../services/fee.service';
import { setAuthorizedRoles, isAuthenticated } from '../utils/middleware';
import {
  ZFee,
  ZFeeFind,
  ZFeePut,
  ZFeeSerial,
} from '../validator/fee.validator';
import { ZRole } from '../validator/general.validator';

const feeRouter = express.Router();

// GET ALL, GET for specific student, GET:id, POST, DELETE, PUT (set as paid)
feeRouter.get(
  '/',
  setAuthorizedRoles([ZRole.enum.Admin, ZRole.enum.Student]),
  isAuthenticated,
  async (req, res) => {
    const zFeeFind = ZFeeFind.parse(req.query);
    const fees = await getFees(zFeeFind);
    return res.status(200).json(fees).end();
  }
);

feeRouter.get(
  '/:serial',
  setAuthorizedRoles([ZRole.enum.Admin, ZRole.enum.Student]),
  isAuthenticated,
  async (req, res) => {
    const zFeeSerial = ZFeeSerial.parse(req.params.serial);
    const fees = await getFee(zFeeSerial);
    return res.status(200).json(fees).end();
  }
);

// Generally speaking, even admins (or clients) shouldn't have the ability
// to change a "fee" or other resources as it pleases them... I think?
feeRouter.post(
  '/',
  setAuthorizedRoles([ZRole.enum.Admin]),
  isAuthenticated,
  async (req: Request, res: Response) => {
    const zFee = ZFee.parse(req.body);

    const fee = await createFee(zFee);

    return res.status(200).json(fee).end();
  }
);

feeRouter.put(
  '/',
  setAuthorizedRoles([ZRole.enum.Admin]),
  isAuthenticated,
  async (req: Request, res: Response) => {
    const zFeePut = ZFeePut.parse(req.body);

    const fee = await updateFee(zFeePut);

    return res.status(200).json(fee).end();
  }
);

feeRouter.delete(
  '/:serial',
  setAuthorizedRoles([ZRole.enum.Admin]),
  isAuthenticated,
  async (req: Request, res: Response) => {
    const zFeeSerial = ZFeeSerial.parse(req.params.serial);
    const fee = await deleteFee(zFeeSerial);
    return res.status(200).json(fee).end();
  }
);

export default feeRouter;
