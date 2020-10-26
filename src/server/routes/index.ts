/* PLOP_INJECT_IMPORT */
import session from "./session";
import user from "./user";

export const mountRoutes = (app) => {
  /* PLOP_INJECT_MOUNT */
  app.use("/api/sessions", session);
  app.use("/api/users", user);
};
