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
  ZFeeDelete,
  ZFeeFind,
  ZFeeGet,
  ZFeePost,
  ZFeePut,
} from '../validator/fee.validator';
import { ZRole } from '../validator/general.validator';

const feeRouter = express.Router();

// Inconsistent logic, if admin requests, return everything,
// if user requests return his own resources only.
feeRouter.get(
  '/',
  setAuthorizedRoles([ZRole.enum.Admin, ZRole.enum.Student]),
  isAuthenticated,
  async (req, res) => {
    /* 
      #swagger.tags = ['Fees']
      #swagger.security = [{ "cookieAuth": [] }]
    */
    const { query, user } = ZFeeFind.parse(req);

    const fees = await getFees(query, user);

    return res.status(200).json(fees).end();
  }
);

// Experimental, non-nested & somewhat resource (owner) protected route.
// and probably *non-rest* too :) #37
feeRouter.get(
  '/:serial',
  setAuthorizedRoles([ZRole.enum.Admin, ZRole.enum.Student]),
  isAuthenticated,
  async (req, res) => {
    /* 
      #swagger.tags = ['Fees']
      #swagger.security = [{ "cookieAuth": [] }]
    */
    // ~3rd method to validate requests.
    // as opposed to the other one
    // This way I don't have to "hard-code" types in the req parameter.
    const { params, user } = ZFeeGet.parse(req);

    const fee = await getFee(params.serial, user);

    if (!fee) return res.status(404).json({ message: 'Fee not found' }).end();

    return res.status(200).json(fee).end();
  }
);

// Generally speaking, even admins (or clients) shouldn't have the ability
// to change a "fee" or other resources as it pleases them... I think?
feeRouter.post(
  '/',
  setAuthorizedRoles([ZRole.enum.Admin]),
  isAuthenticated,
  async (req: Request, res: Response) => {
    /* 
      #swagger.tags = ['Fees']
      #swagger.security = [{ "cookieAuth": [] }]
    */
    const { body } = ZFeePost.parse(req);

    const fee = await createFee(body);

    return res.status(200).json(fee).end();
  }
);

feeRouter.put(
  '/',
  setAuthorizedRoles([ZRole.enum.Admin]),
  isAuthenticated,
  async (req: Request, res: Response) => {
    /* 
      #swagger.tags = ['Fees']
      #swagger.security = [{ "cookieAuth": [] }]
    */
    const { body } = ZFeePut.parse(req);

    const fee = await updateFee(body);

    return res.status(200).json(fee).end();
  }
);

feeRouter.delete(
  '/:serial',
  setAuthorizedRoles([ZRole.enum.Admin]),
  isAuthenticated,
  async (req: Request, res: Response) => {
    /* 
      #swagger.tags = ['Fees']
      #swagger.security = [{ "cookieAuth": [] }]
    */
    const { params } = ZFeeDelete.parse(req);

    const fee = await deleteFee(params.serial);

    return res.status(200).json(fee).end();
  }
);

export default feeRouter;
