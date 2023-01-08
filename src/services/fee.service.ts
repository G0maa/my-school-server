import Fee from '../models/fee';
import {
  ZFee,
  ZFeeFind,
  ZFeePut,
  ZFeeSerial,
} from '../validator/fee.validator';

const getFees = async (zFeeFind: ZFeeFind) => {
  const fees = await Fee.findAll({ where: { ...zFeeFind } });
  return fees;
};

// To-do proper error message if not found.
// To-do only student that has this fee can access it
const getFee = async (serial: ZFeeSerial) => {
  const fee = await Fee.findOne({ where: { serial } });
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
