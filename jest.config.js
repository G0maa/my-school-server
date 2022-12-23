/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  collectCoverageFrom: ['**/src/**/**', '!**/src/migrations/**'], // This may not reflect actual coverage.
  coverageProvider: 'v8',
  coverageReporters: ['lcov', 'text', 'text-summary'],
  globalSetup: './src/tests/setup.ts',
  globalTeardown: './src/tests/teardown.ts',
};
