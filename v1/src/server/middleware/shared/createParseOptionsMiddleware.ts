import { SyncOptions } from "../../../shared/types";
import { RequestHandler } from "express";
import { ValidationError } from "joi";
import { convertValidatorErrorToParseOptionsError } from "./helpers";

export const createParseOptionsMiddleware = <T extends SyncOptions>(
  validateOptionsFunction: (options: any) => T
): RequestHandler => {
  return (req, res, next) => {
    try {
      res.locals.options = validateOptionsFunction(req.query);
    } catch (err) {
      if (err instanceof ValidationError) {
        convertValidatorErrorToParseOptionsError(err);
      } else {
        next(err);
      }
    }
    next();
  };
};
