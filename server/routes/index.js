/* PLOP_INJECT_REQUIRE */
const session = require("./session");
const user = require("./user");

const mountRoutes = (app) => {
  /* PLOP_INJECT_MOUNT */
  app.use("/api/sessions", session);
  app.use("/api/users", user);
};

module.exports = mountRoutes;
