/* PLOP_INJECT_REQUIRE */
const user = require("./user");

const mountRoutes = (app) => {
  /* PLOP_INJECT_MOUNT */
  app.use("/users", user);
};

module.exports = mountRoutes;
