import dotenv from 'dotenv';
// require('dotenv').config();
dotenv.config();

const { PORT, NODE_ENV } = process.env;
const DATABASE_URL =
  NODE_ENV === 'DEV' ? process.env.DEV_DATABASE_URL : process.env.DATABASE_URL;

// There's probably a better way to do this,
// also I didn't use express-async-errors,
// since this is not HTTP related.
if (!DATABASE_URL || !PORT || !NODE_ENV) {
  throw new Error('One or more of the config parameters was not found.');
}

export default {
  PORT,
  NODE_ENV,
  DATABASE_URL,
};
