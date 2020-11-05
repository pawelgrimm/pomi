import { ErrorRequestHandler } from "express";
import { ValidationError } from "joi";
import { ParseOptionsError } from "../../errors";

export const validationErrorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  next
) => {
  if (err instanceof ValidationError) {
    res.status(422).send({ errors: err.details });
  } else if (err instanceof ParseOptionsError) {
    res.status(422).send({ errors: err.message });
  }
  next(err);
};
