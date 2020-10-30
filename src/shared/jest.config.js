module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  notify: true,
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json",
    },
  },
};
