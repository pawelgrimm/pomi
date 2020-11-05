import { RequestHandler } from "express";
import { parseSelectAllOptions } from "../../db/queries/projects";

export const parseOptions: RequestHandler = (req, res, next) => {
  res.locals.options = parseSelectAllOptions(req.query);
  next();
};
