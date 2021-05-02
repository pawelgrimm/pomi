module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  globals: {
    "ts-jest": {
      tsconfig: "src/server/tsconfig.json",
    },
  },
  collectCoverageFrom: ["**/*.ts"],
  coverageReporters: ["text"],
};
