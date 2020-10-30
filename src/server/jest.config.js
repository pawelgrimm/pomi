module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  notify: true,
  setupFiles: ["./setupTest.js"],
  globals: {
    "ts-jest": {
      tsconfig: "src/server/tsconfig.json",
    },
  },
};
