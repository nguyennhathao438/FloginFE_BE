export default {
  testEnvironment: "jest-environment-jsdom",
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest",
  },
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
  moduleFileExtensions: ["js", "jsx", "ts", "tsx", "json", "node"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
  reporters: [
    "default",
    [
      "jest-html-reporter",
      {
        pageTitle: "Test Report",
        outputPath: "test-results/test-report.html",
        includeFailureMsg: true,
        includeConsoleLog: true,
      },
    ],
  ],
  testResultsProcessor: "jest-html-reporter",
};
