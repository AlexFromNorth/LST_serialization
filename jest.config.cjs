module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/*.test.js'],
  transform: {},
  collectCoverageFrom: ['src/*.js', '!src/*.test.js'],
  coverageDirectory: 'coverage',
  verbose: true,
};
