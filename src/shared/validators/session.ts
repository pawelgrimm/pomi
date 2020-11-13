import Joi from "joi";
import { Schema } from "@hapi/joi";
import { SessionModel, SessionSelectOptions } from "../types";
import { InvalidMethodError } from "./errors";
import { Method, standardFieldAlter } from "./shared";
import camelcaseKeys from "camelcase-keys";
import { validateSyncToken } from "../utils";

const NOTES_LENGTH_LIMIT = 1000;

/**
 * List of methods allowed when validating a session
 */
type SessionMethods = Method.CREATE | Method.UPDATE | Method.PARTIAL;

/**
 * Schema used to validate sessions before inserting them into the database
 */
const sessionSchema = Joi.object({
  id: Joi.string()
    .trim()
    .uuid({ version: "uuidv4" })
    .alter({
      [Method.CREATE]: (schema) => schema.forbidden(),
      [Method.UPDATE]: (schema) => schema.required(),
      [Method.PARTIAL]: (schema) => schema.required(),
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
  isRetroAdded: Joi.boolean().default(false).optional(),
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
  [Method.UPDATE, sessionSchema.unknown(false).tailor(Method.UPDATE)],
  [Method.PARTIAL, sessionSchema.unknown(false).tailor(Method.PARTIAL)],
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

/**
 * Schema representing valid options for GET sessions options
 */
const sessionSelectOptionsSchema = Joi.object({
  syncToken: Joi.string()
    .trim()
    .optional()
    .default("*")
    .custom(validateSyncToken),
  start: Joi.date().iso().optional(),
  end: Joi.date()
    .iso()
    .optional()
    .when("start", {
      is: Joi.exist(),
      then: Joi.date().greater(Joi.ref("start")),
    }),
});

/**
 * Validate session select options and set defaults
 * @param sessionSelectOptions - a SessionSelectOptions-like object
 */
export const validateSessionSelectOptions = (
  sessionSelectOptions: {} = {}
): SessionSelectOptions => {
  sessionSelectOptions = camelcaseKeys(sessionSelectOptions);
  return Joi.attempt(
    sessionSelectOptions,
    sessionSelectOptionsSchema
  ) as SessionSelectOptions;
};
