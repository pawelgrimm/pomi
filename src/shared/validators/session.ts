import Joi from "joi";
import { Schema } from "@hapi/joi";
import { SessionModel, SessionOptions } from "../types";
import { InvalidMethodError } from "./errors";
import { Method, standardFieldAlter } from "./shared";
import camelcaseKeys from "camelcase-keys";
import { validateSyncToken } from "../utils";

const NOTES_LENGTH_LIMIT = 1000;

/**
 * List of methods allowed when validating a session
 */
export type SessionMethods = Method.CREATE | Method.UPDATE | Method.PARTIAL;

/**
 * Schema used to validate sessions before inserting them into the database
 */
const sessionSchema = Joi.object({
  id: Joi.string()
    .trim()
    .uuid({ version: "uuidv4" })
    .alter({
      [Method.CREATE]: (schema) => schema.forbidden(),
      [Method.UPDATE]: (schema) => schema.optional(),
      [Method.PARTIAL]: (schema) => schema.optional(),
    }),
  taskId: Joi.string()
    .trim()
    .uuid({ version: "uuidv4" })
    .alter(standardFieldAlter),
  startTimestamp: Joi.date().iso().alter(standardFieldAlter),
  duration: Joi.number().alter({
    [Method.CREATE]: (schema) => schema.required(),
    [Method.UPDATE]: (schema) => schema.required(),
    [Method.PARTIAL]: (schema) =>
      schema.when("startTimestamp", {
        is: Joi.exist(),
        then: Joi.required(),
        otherwise: Joi.optional(),
      }),
  }),
  type: Joi.string()
    .trim()
    .allow("session", "break", "long-break")
    .alter(standardFieldAlter),
  notes: Joi.string().trim().max(NOTES_LENGTH_LIMIT).optional(),
  isRetroAdded: Joi.boolean().alter({
    [Method.CREATE]: (schema) => schema.default(false).optional(),
    [Method.UPDATE]: (schema) => schema.forbidden(),
    [Method.PARTIAL]: (schema) => schema.forbidden(),
  }),
});

/**
 * A map of schemas by method type
 */
const sessionSchemas = new Map<SessionMethods, Schema>([
  [
    Method.CREATE,
    sessionSchema
      .options({
        stripUnknown: true,
      })
      .tailor(Method.CREATE),
  ],
  [Method.UPDATE, sessionSchema.tailor(Method.UPDATE)],
  [Method.PARTIAL, sessionSchema.tailor(Method.PARTIAL)],
]);

/**
 * Validate a Session
 * @param session - a SessionModel-like object
 * @param method - a string representing the validation type to use, like "CREATE" or "PATCH"
 * @returns the object as a SessionModel
 */
export const validateSession = (
  session: any,
  method: SessionMethods = Method.CREATE
): SessionModel => {
  const schema = sessionSchemas.get(method);

  if (!schema) throw new InvalidMethodError(method);

  return Joi.attempt(session, schema) as SessionModel;
};

export type SessionOptionMethods = Method.SYNC | Method.SELECT;

/**
 * Schema representing valid options for GET sessions options
 */
const sessionSelectOptionsSchema = Joi.object({
  syncToken: Joi.string()
    .trim()
    .custom((value) => validateSyncToken(value))
    .alter({
      [Method.SYNC]: (schema) => schema.optional(),
      [Method.SELECT]: (schema) => schema.forbidden(),
    }),
  start: Joi.date()
    .iso()
    .alter({
      [Method.SYNC]: (schema) => schema.forbidden(),
      [Method.SELECT]: (schema) => schema.optional(),
    }),
  end: Joi.date()
    .iso()
    .when("start", {
      is: Joi.exist(),
      then: Joi.date().greater(Joi.ref("start")),
    })
    .alter({
      [Method.SYNC]: (schema) => schema.forbidden(),
      [Method.SELECT]: (schema) => schema.optional(),
    }),
});

/**
 * A map of schemas by method type
 */
const sessionOptionsSchemas = new Map<SessionOptionMethods, Schema>([
  [Method.SYNC, sessionSelectOptionsSchema.tailor(Method.SYNC)],
  [Method.SELECT, sessionSelectOptionsSchema.tailor(Method.SELECT)],
]);

/**
 * Validate session select options and set defaults
 * @param options - a SessionSelectOptions-like object
 * @param method - a string representing the validation type to use, like "CREATE" or "PATCH"
 * @returns validated options
 */
export const validateSessionOptions = (
  options: any = {},
  method?: SessionOptionMethods
): SessionOptions => {
  options = camelcaseKeys(options);

  let schema: Schema = sessionSelectOptionsSchema;

  if (method) {
    schema = sessionOptionsSchemas.get(method) || schema;

    if (!schema) throw new InvalidMethodError(method);
  }

  return Joi.attempt(options, schema) as SessionOptions;
};
