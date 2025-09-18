module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [
    "**/tests/**/*.test.ts"
  ],
  modulePathIgnorePatterns: [
    "<rootDir>/backend/dashboard/tourism-admin-dashboard/"
  ]
};
