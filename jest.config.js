/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  globalSetup: './src/tests/setup.ts',
  globalTeardown: './src/tests/teardown.ts',
};
