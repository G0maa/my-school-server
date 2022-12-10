import bcrypt from 'bcrypt';
import crypto from 'crypto';
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
export { hashPassword, verifyPassword, generateRandomPassword };
