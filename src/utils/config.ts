import dotenv from 'dotenv';
// require('dotenv').config();
dotenv.config();
// Write Test for login for default admin
// wrap-up logging in generally.
const { PORT, NODE_ENV, SECRET } = process.env;
// const DATABASE_URL = ()
//   NODE_ENV === 'PROD' ? process.env.DATABASE_URL : process.env.DEV_DATABASE_URL;

let DATABASE_URL;
switch (NODE_ENV) {
  case 'PROD':
    DATABASE_URL = process.env.DATABASE_URL;
    break;
  case 'DEV':
    DATABASE_URL = process.env.DEV_DATABASE_URL;
    break;
  case 'test':
    DATABASE_URL = process.env.TEST_DATABASE_URL;
    break;
}

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS || '10');
// There's probably a better way to do this,
// also I didn't use express-async-errors,
// since this is not HTTP related.
if (!DATABASE_URL || !PORT || !NODE_ENV || !SECRET) {
  throw new Error('One or more of the config parameters was not found.');
}

export default {
  PORT,
  NODE_ENV,
  DATABASE_URL,
  SALT_ROUNDS,
  SECRET,
};
