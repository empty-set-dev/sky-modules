const { defaults } = require('jest-config');

module.exports = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  coverageProvider: 'v8',
  extensionsToTreatAsEsm: ['.ts'],
  testMatch: ['**/standard/globalify/**/*.test.[jt]s?(x)'],
    transform: {
      '^.+\\.[tj]sx?$': ['ts-jest', {
        useESM: true,
        tsconfig: 'tsconfig.json',
        diagnostics: false
      }],
    },
  moduleNameMapper: {
    '^sky/(.*)$': '<rootDir>/$1',
  },
  collectCoverageFrom: [
    'standard/globalify/index.ts',
    'standard/globalify/_globalify.ts'
  ],
  transformIgnorePatterns: [
    '/node_modules/(?!(brace-expansion|minimatch)/)'
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
