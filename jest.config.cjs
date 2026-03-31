/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: {
          module: 'commonjs',
          moduleResolution: 'node',
          strict: true,
          esModuleInterop: true,
        },
      },
    ],
  },
  testMatch: ['**/__tests__/**/*.property.test.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^react-native-mmkv$': '<rootDir>/__mocks__/react-native-mmkv.cjs',
  },
};
