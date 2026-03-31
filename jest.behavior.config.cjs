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
          jsx: 'react',
        },
      },
    ],
  },
  testMatch: ['**/__tests__/**/*.test.tsx'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    // Use an inline manual mock for react-native-reanimated to avoid
    // pulling in react-native ESM dependencies from the official mock
    '^react-native-reanimated$': '<rootDir>/__mocks__/react-native-reanimated.cjs',
    '^react-native-mmkv$': '<rootDir>/__mocks__/react-native-mmkv.cjs',
  },
};
