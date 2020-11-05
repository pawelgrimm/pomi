import { ErrorRequestHandler } from "express";

export const logError: ErrorRequestHandler = (err, req, res, next) => {
  if (process.env.NODE_ENV === "test") {
    const testOptionsHeader = req.get("X-Test-Options");
    let testOptions;

    try {
      testOptions = testOptionsHeader ? JSON.parse(testOptionsHeader) : {};
    } catch (e) {
      console.error(e);
    }

    if (!testOptions?.suppressErrorLogging) {
      console.error(err);
    }
  } else {
    console.error(err);
  }
  next(err);
};
