var globalConfig = require('./config/config')

module.exports = {
  testURL: 'http://localhost:8000',
  testEnvironment: 'jsdom',
  verbose: true,
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  globals: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: false,
    localStorage: null,
    ...globalConfig.default.define
  }
}
