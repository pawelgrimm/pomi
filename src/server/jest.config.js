module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  globals: {
    "ts-jest": {
      tsconfig: "src/server/tsconfig.json",
    },
  },
  collectCoverageFrom: ["**/*.ts"],
  coverageReporters: ["text"],
  globalSetup: "./globalSetup.js",
};
