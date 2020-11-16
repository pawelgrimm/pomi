import { RequestHandler } from "express";
import { validateSessionOptions } from "../../../shared/validators";
import { Method } from "../../../shared/validators/shared";
import { ParseOptionsError } from "../../errors";
import { ValidationError } from "joi";

const convertValidatorErrorToParseOptionsError = (error: ValidationError) => {
  const paths = error.details.map(({ path, message }) => {
    const name = path.join(", ");
    return { name, message };
  });
  throw new ParseOptionsError(paths);
};

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
