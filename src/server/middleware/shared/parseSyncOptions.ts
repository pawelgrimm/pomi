import { RequestHandler } from "express";
import { validateSyncOptions } from "../../../shared/validators";
import { ValidationError } from "joi";
import { convertValidatorErrorToParseOptionsError } from "./helpers";

export const parseSyncOptions: RequestHandler = (req, res, next) => {
  try {
    res.locals.options = validateSyncOptions(req.query);
  } catch (err) {
    if (err instanceof ValidationError) {
      convertValidatorErrorToParseOptionsError(err);
    } else {
      next(err);
    }
  }
  next();
};
