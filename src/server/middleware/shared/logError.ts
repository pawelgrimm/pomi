import { ErrorRequestHandler } from "express";

export const logError: ErrorRequestHandler = (err, req, res, next) => {
  if (process.env.NODE_ENV === "test") {
    const suppressErrors = req.get("X-Test-Suppress-Error-Logging") === "true";

    if (!suppressErrors) {
      console.error(err);
    }
  } else {
    console.error(err);
  }
  next(err);
};
