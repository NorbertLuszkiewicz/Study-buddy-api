const config = {
  preset: 'ts-jest',
  verbose: true,
  testEnvironment: 'node',
  testMatch: ['**/**/*.test.js'],
  forceExit: true,
  clearMocks: true,
};

export default config;
