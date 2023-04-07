import Fee from '../models/fee';
import { getPagination, querifyStringFields } from '../utils/helpers';
import { ZFee, ZFeeFind, ZFeePut } from '../validator/fee.validator';
import { ZReqUser } from '../validator/user.validator';

const getFees = async (zFeeFind: ZFeeFind['query'], user: ZReqUser) => {
  const { offset, limit, rest } = getPagination(zFeeFind);

  const querified = querifyStringFields(rest, ZFeeFind.shape.query);

  let fees;
  if (user.role === 'Admin')
    fees = await Fee.findAndCountAll({ where: querified, offset, limit });
  else
    fees = await Fee.findAndCountAll({
      where: { ...querified, studentId: user.id },
      offset,
      limit,
    });
  return fees;
};

const getFee = async (serial: ZFee['serial'], user: ZReqUser) => {
  const fee = await Fee.findOne({
    where: { serial },
  });

  // 1. fee exists, 2. user authorized, 3. user "owns" the resource.
  if (fee && (user.role === 'Admin' || user.id === fee.studentId)) return fee;

  return;
};

const createFee = async (zFee: ZFee) => {
  const fee = await Fee.create({ ...zFee });
  return fee;
};

const updateFee = async (zFee: ZFeePut['body']) => {
  const fee = await Fee.findOne({ where: { serial: zFee.serial } });

  // To-do proper error message if not found.
  if (!fee) return;

  fee.set(zFee);

  await fee.save();

  return fee;
};

const deleteFee = async (serial: ZFee['serial']) => {
  const fee = await Fee.destroy({ where: { serial } });
  return fee;
};

export { getFees, getFee, createFee, updateFee, deleteFee };
