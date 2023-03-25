import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { sequelize } from './db';
import config from './config';
import { QueryTypes } from 'sequelize';
import { ValidateRawQuery } from '../validator/student.validator';
import { z } from 'zod';
import { Op } from 'sequelize';
import { Paginate } from '../types';

const hashPassword = async (password: string) => {
  const hashedPassword = await bcrypt.hash(password, config.SALT_ROUNDS);
  return hashedPassword;
};

const verifyPassword = async (password: string, passwordHash: string) => {
  const isCorect = await bcrypt.compare(password, passwordHash);
  return isCorect;
};

const generateRandomPassword = () => {
  return crypto.randomInt(100000, 999999).toString();
};

const formatUsername = (lastValue: number, tableName: string) => {
  const firstLetter = tableName[0].toUpperCase();
  const temp = firstLetter.concat('0000');
  const trimmed = temp.slice(0, temp.length - lastValue.toString().length);
  return trimmed.concat(lastValue.toString());
};

const generateSerialUsername = async (tableName: string) => {
  // Need to refactor this sooner or later.
  const rawQuery = await sequelize.query(
    `SELECT max(last_value) as "lastValue", max(serial) as "maxSerial"
     FROM ${tableName}_serial_seq CROSS JOIN ${tableName}`,
    { type: QueryTypes.SELECT }
  );

  const rawQueryObj = ValidateRawQuery.parse(rawQuery);

  let nextNum = parseInt(rawQueryObj[0].lastValue || '0');

  if (!rawQueryObj[0].lastValue) nextNum = 0;
  nextNum += 1;
  return formatUsername(nextNum, tableName);
};

// Note: This assumes validation in the controller, see ZPaginate.
const getPagination = ({ page, size, ...rest }: Paginate) => {
  // If it's not validated = I get warned.
  if (!page || !size)
    throw new Error('Page and size are required for pagination');

  const offset = (page - 1) * size;
  const limit = size;
  return { offset, limit, rest };
};

const mostInnerType = (field: z.ZodTypeAny) => {
  while (field._def.innerType) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    field = field._def.innerType;
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return field._def.typeName;
};

// I'm not sure if this is a "good" function.
const querifyStringFields = (
  object: Record<string, unknown>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema: z.ZodObject<any, any>
) => {
  // console.log('schema.shape', schema.shape);
  for (const key in schema.shape) {
    // for ... in loops over everything,
    // this if condition is to make sure it only loops over the attributes only.
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, no-prototype-builtins
    if (!schema.shape.hasOwnProperty(key)) continue;

    // Just making sure key exists in the object, might be optional.
    if (object[key] === undefined) continue;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const field = schema.shape[key];

    // For ZodOptional<ZodString> and similar cases.
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument
    const typeName = mostInnerType(field);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (typeName === 'ZodString')
      object[key] = { [Op.like]: `%${object[key]}%` };
  }
  return object;
};

export {
  hashPassword,
  verifyPassword,
  generateRandomPassword,
  generateSerialUsername,
  getPagination,
  querifyStringFields,
};
