/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  roots: ['<rootDir>/src'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  collectCoverageFrom: [
    '**/src/**/**',
    '!**/src/migrations/**',
    '!**/src/validator/**',
    '!**/src/models/**',
  ], // This may not reflect actual coverage.
  coverageProvider: 'v8',
  coverageReporters: ['cobertura', 'text', 'text-summary'],
  globalSetup: './src/tests/setup.ts',
  globalTeardown: './src/tests/teardown.ts',
};
