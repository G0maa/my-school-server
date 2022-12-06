import bcrypt from 'bcrypt';
import config from './config';
const hashPassword = async (password: string) => {
  const hashedPassword = await bcrypt.hash(password, config.SALT_ROUNDS);
  return hashedPassword;
};

const verifyPassword = async (password: string, passwordHash: string) => {
  const isCorect = await bcrypt.compare(password, passwordHash);
  return isCorect;
};
export { hashPassword, verifyPassword };
