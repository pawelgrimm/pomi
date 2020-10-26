import { Express } from "express";
/* PLOP_INJECT_IMPORT */
import session from "./session";
import user from "./user";

export const mountRoutes = (app: Express) => {
  /* PLOP_INJECT_MOUNT */
  app.use("/api/sessions", session);
  app.use("/api/users", user);
};
