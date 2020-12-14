module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json",
    },
  },
  collectCoverageFrom: ["**/*.ts"],
  coverageReporters: ["text"],
  testPathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/src/server",
    "<rootDir>/src/shared",
  ],
};
