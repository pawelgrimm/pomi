import { Schema } from "@hapi/joi";
import Joi from "joi";
import { validateSyncToken } from "../../utils/models";
import { SyncOptions } from "../../types";
import camelcaseKeys from "camelcase-keys";

/**
 * A set of methods supported for validating with a session schema
 */
export enum Method {
  CREATE = "CREATE",
  UPDATE = "UPDATE",
  PARTIAL = "PARTIAL",
  SYNC = "SYNC",
  SELECT = "SELECT",
}

/**
 * A set of functions to set a schema to required or optional based on the method type
 */
export const standardFieldAlter = {
  [Method.CREATE]: (schema: Schema) => schema.required(),
  [Method.UPDATE]: (schema: Schema) => schema.required(),
  [Method.PARTIAL]: (schema: Schema) => schema.optional(),
};

/**
 * Schema representing valid options for GET sessions options
 */
const syncOptionsSchema = Joi.object({
  syncToken: Joi.string()
    .trim()
    .custom(validateSyncToken)
    .default("*")
    .optional(),
});

/**
 * Validate session select options and set defaults
 * @param options - a SessionSelectOptions-like object
 * @returns validated options
 */
export const validateSyncOptions = (options: any): SyncOptions => {
  options = camelcaseKeys(options);

  return Joi.attempt(options, syncOptionsSchema) as SyncOptions;
};
