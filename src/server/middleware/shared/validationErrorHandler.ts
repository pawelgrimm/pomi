import { ErrorRequestHandler } from "express";
import { ValidationError } from "joi";

export const validationErrorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  next
) => {
  if (err instanceof ValidationError) {
    res.status(422).send({ errors: err.details });
  }
  next(err);
};
