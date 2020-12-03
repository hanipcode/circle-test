module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^#/constants(.*)$': '<rootDir>/src/constants$1',
    '^#/views(.*)$': '<rootDir>/src/views$1',
    '^#/helpers(.*)$': '<rootDir>/src/helpers$1',
    '^#/components(.*)$': '<rootDir>/src/components$1',
    '^#/mocks(.*)$': '<rootDir>/src/mocks$1',
    '^#/styles(.*)$': '<rootDir>/src/styles$1',
  },
  setupFiles: ['<rootDir>/jestEnvSetup.js'],
  setupFilesAfterEnv: ['<rootDir>/jestServerSetup.js'],
  globals: {
    // we must specify a custom tsconfig for tests because we need the typescript transform
    // to transform jsx into js rather than leaving it jsx such as the next build requires.  you
    // can see this setting in tsconfig.jest.json -> "jsx": "react"
    'ts-jest': {
      tsconfig: 'tsconfig.jest.json',
    },
  },
};
