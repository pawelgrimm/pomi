import { RequestHandler } from "express";

export const parseSelectAllOptions: RequestHandler = (req, res, next) => {
  const { sync_token, include_archived } = req.query;
  res.locals.options = {
    syncToken: (sync_token && sync_token.toString()) || "*",
    includeArchived: !!include_archived,
  };
  next();
};
