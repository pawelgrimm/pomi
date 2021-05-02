import { ErrorRequestHandler } from "express";

export const handleError: ErrorRequestHandler = (err, req, res, next) => {
  res.send({ error: err?.message });
};
