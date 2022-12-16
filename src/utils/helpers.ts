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

const formatUsername = (lastValue: number) => {
  const temp = 'S0000';
  const trimmed = temp.slice(0, temp.length - lastValue.toString().length);
  return trimmed.concat(lastValue.toString());
};

// Works only for student, for now.
const generateSerialUsername = async () => {
  // Need to refactor this sooner or later.
  const rawQuery = await sequelize.query(
    `SELECT max(last_value) as "lastValue", max(serial) as "maxSerial"
     FROM students_serial_seq CROSS JOIN students`,
    { type: QueryTypes.SELECT }
  );
  // console.log('rawQuery', rawQuery);

  const rawQueryObj = ValidateRawQuery.parse(rawQuery);

  // console.log('rawQueryObj', rawQueryObj);

  let nextNum = parseInt(rawQueryObj[0].lastValue || '0');

  // console.log('nextNum', nextNum);

  if (!rawQueryObj[0].lastValue) nextNum = 0;
  nextNum += 1;
  return formatUsername(nextNum);
};

export {
  hashPassword,
  verifyPassword,
  generateRandomPassword,
  generateSerialUsername,
};
