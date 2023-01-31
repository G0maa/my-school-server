import Fee from '../models/fee';
import {
  ZFee,
  ZFeeFind,
  ZFeePut,
  ZFeeSerial,
} from '../validator/fee.validator';
import { ZUuid } from '../validator/general.validator';

const getFees = async (zFeeFind: ZFeeFind) => {
  const fees = await Fee.findAll({ where: { ...zFeeFind } });
  return fees;
};

const getFee = async (serial: ZFeeSerial, studentId?: ZUuid) => {
  // I'm not sure how to get rid of this, or if I should,
  // it seems a bit too verbose, but ORM can't have an attribute of undefined
  // **in the where object**
  let query: object = { serial };
  if (studentId) query = { ...query, studentId };

  const fee = await Fee.findOne({
    where: { ...query },
  });

  if (!fee) return;

  return fee;
};

const createFee = async (zFee: ZFee) => {
  const fee = await Fee.create({ ...zFee });
  return fee;
};

const updateFee = async (zFee: ZFeePut) => {
  const fee = await Fee.findOne({ where: { serial: zFee.serial } });

  // To-do proper error message if not found.
  if (!fee) return;

  fee.set(zFee);

  await fee.save();

  return fee;
};

const deleteFee = async (serial: ZFeeSerial) => {
  const fee = await Fee.destroy({ where: { serial } });
  return fee;
};

export { getFees, getFee, createFee, updateFee, deleteFee };
