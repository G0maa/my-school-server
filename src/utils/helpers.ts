import bcrypt from 'bcrypt';
import config from './config';
const hashPassword = async (password: string) => {
  const hashedPassword = await bcrypt.hash(password, config.SALT_ROUNDS);
  return hashedPassword;
};

export { hashPassword };
