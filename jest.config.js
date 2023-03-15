/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  roots: ['<rootDir>/src'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  // This may not reflect actual coverage & maybe some files can be unit-tested not api-tested
  collectCoverageFrom: [
    '**/src/**/**.ts',
    '!**/src/migrations/**',
    '!**/src/models/**',
    '!**/src/controllers/dev.ts',
    '!**/src/utils/rollback.ts',
    '!**/src/utils/rollbackAll.ts',
    '!**/src/utils/swagger.ts',
    '!**/src/types.ts',
  ],
  coverageProvider: 'v8',
  coverageReporters: ['lcov', 'text', 'text-summary'],
  globalSetup: './src/tests/setup.ts',
  globalTeardown: './src/tests/teardown.ts',
};
