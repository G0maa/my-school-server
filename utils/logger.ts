/* eslint-disable no-console */
const info = (...params: unknown[]) => {
  console.log(...params);
};

const error = (...params: unknown[]) => {
  console.log(...params);
};

export default {
  info,
  error,
};
