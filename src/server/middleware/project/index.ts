import { RequestHandler } from "express";
import { Project } from "../../db/models";

export const parseOptions: RequestHandler = (req, res, next) => {
  res.locals.options = Project.parseSelectAllOptions<string>(req.query);
  next();
};
