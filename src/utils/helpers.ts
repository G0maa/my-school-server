import bcrypt from 'bcrypt';
import crypto from 'crypto';
// import { Student } from '../models';
import { Student } from '../models';
import config from './config';

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
  // Again, if it's not a number = we are doomed.
  let nextUsername: number = await Student.max('serial');
  if (!nextUsername) nextUsername = 0;
  nextUsername += 1;
  return formatUsername(nextUsername);
};

export {
  hashPassword,
  verifyPassword,
  generateRandomPassword,
  generateSerialUsername,
};
