import { Schema } from "@hapi/joi";

/**
 * A set of methods supported for validating with a session schema
 */
export enum Method {
  CREATE = "CREATE",
  UPDATE = "UPDATE",
  PARTIAL = "PARTIAL",
}

/**
 * A set of functions to set a schema to required or optional based on the method type
 */
export const standardFieldAlter = {
  [Method.CREATE]: (schema: Schema) => schema.required(),
  [Method.UPDATE]: (schema: Schema) => schema.required(),
  [Method.PARTIAL]: (schema: Schema) => schema.optional(),
};
