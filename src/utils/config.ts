import dotenv from 'dotenv';
// require('dotenv').config();
dotenv.config();

const { PORT, NODE_ENV } = process.env;

export default {
  PORT,
  NODE_ENV,
};
