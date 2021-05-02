import camelcaseKeys from "camelcase-keys";
import { RequestHandler } from "express";

export const camelCaseQueryParams: RequestHandler = (req, res, next) => {
  if (req.query) {
    req.query = camelcaseKeys(req.query);
  }
  next();
};
