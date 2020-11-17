import { RequestHandler } from "express";
import { validateSessionOptions } from "../../../shared/validators";
import { Method } from "../../../shared/validators/shared";
import { ValidationError } from "joi";
import { convertValidatorErrorToParseOptionsError } from "../shared/helpers";

export const parseSyncOptions: RequestHandler = (req, res, next) => {
  try {
    res.locals.options = validateSessionOptions(req.query, Method.SYNC);
  } catch (err) {
    if (err instanceof ValidationError) {
      convertValidatorErrorToParseOptionsError(err);
    } else {
      next(err);
    }
  }
  next();
};

export const parseSelectOptions: RequestHandler = (req, res, next) => {
  try {
    res.locals.options = validateSessionOptions(req.query, Method.SELECT);
  } catch (err) {
    if (err instanceof ValidationError) {
      convertValidatorErrorToParseOptionsError(err);
    } else {
      next(err);
    }
  }
  next();
};
