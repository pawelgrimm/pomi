import { RequestHandler } from "express";
import { parseSelectAllOptions } from "../../../shared/utils/tasks";

export const parseOptions: RequestHandler = (req, res, next) => {
  res.locals.options = parseSelectAllOptions<string>(req.query);
  next();
};
