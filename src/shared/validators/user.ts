import Joi from "joi";
import { Schema } from "@hapi/joi";
import { UserModel } from "../types";
import { Method, standardFieldAlter } from "./shared";
import { InvalidMethodError } from "./errors";

// Schema used to validate users before inserting them into the database
const userSchema = Joi.object({
  id: Joi.string().max(255).alter(standardFieldAlter),
  displayName: Joi.string()
    .trim()
    .max(255)
    .required()
    .alter(standardFieldAlter),
  email: Joi.string()
    .email({ tlds: false })
    .max(255)
    .required()
    .alter(standardFieldAlter),
  defaultProject: Joi.string().uuid({ version: "uuidv4" }).optional(),
});

// List of methods allowed when validating a user
export type UserMethods = Method.CREATE | Method.PARTIAL;

// A map of schemas tailored by method type
const userSchemas = new Map<UserMethods, Schema>([
  [
    Method.CREATE,
    userSchema
      .options({
        stripUnknown: true,
      })
      .tailor(Method.CREATE),
  ],
  [Method.PARTIAL, userSchema.tailor(Method.PARTIAL)],
]);

/**
 * Validate a user
 * @param user - a UserModel-like object
 * @param method - a string representing the validation type to use, like "CREATE" or "PATCH"
 * @returns the object as a validated UserModel
 */
export const validateUser = (user: any, method: UserMethods): UserModel => {
  const schema = userSchemas.get(method);

  if (!schema) throw new InvalidMethodError(method);

  return Joi.attempt(user, schema) as UserModel;
};
