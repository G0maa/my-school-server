import dotenv from 'dotenv';

dotenv.config();

const { PORT, NODE_ENV } = process.env;

export default {
  PORT,
  NODE_ENV,
};
