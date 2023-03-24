import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { sequelize } from './db';
import config from './config';
import { QueryTypes } from 'sequelize';
import { ValidateRawQuery } from '../validator/student.validator';

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
  // console.log('rawQuery', rawQuery);

  const rawQueryObj = ValidateRawQuery.parse(rawQuery);

  // console.log('rawQueryObj', rawQueryObj);

  let nextNum = parseInt(rawQueryObj[0].lastValue || '0');

  // console.log('nextNum', nextNum);

  if (!rawQueryObj[0].lastValue) nextNum = 0;
  nextNum += 1;
  return formatUsername(nextNum, tableName);
};

// To-Do: Probably a better idea to move this to types.ts
interface Paginate extends Object {
  page: number;
  size: number;
  limit?: number;
  offset?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

// There could be a better place for this.
const Paginate = (object: Paginate) => {
  const { page, size } = object;
  const offset = (page - 1) * size;

  object.offset = offset;
  object.limit = size;
  return object;
};

export {
  hashPassword,
  verifyPassword,
  generateRandomPassword,
  generateSerialUsername,
  Paginate,
};
