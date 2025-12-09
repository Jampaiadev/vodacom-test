module.exports = {
  testEnvironment: 'node',
  testTimeout: 10000,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'html', 'lcov'],
  reporters: [
    'default',
    ['jest-html-reporter', {
      pageTitle: 'API Test Report',
      outputPath: './reports/test-report.html',
      includeFailureMsg: true,
      includeConsoleLog: true
    }]
  ],
  testMatch: ['**/tests/**/*.test.js'],
 // setupFilesAfterEnv: ['<rootDir>/tests/setup.js']
};