import Joi from "joi";

import { ProjectModel, ProjectOptions } from "../types";
import { validateSyncToken } from "../utils/models";
import { Method } from "./shared";
import { Schema } from "@hapi/joi";
import camelcaseKeys from "camelcase-keys";
import { InvalidMethodError } from "./errors";

/**
 * A Joi schema representing a ProjectModel
 */
const projectSchema = Joi.object({
  id: Joi.string().uuid({ version: "uuidv4" }).optional(),
  title: Joi.string().max(255).optional(),
  isArchived: Joi.boolean().optional(),
});

/**
 * Validate and parse an object into as a Project
 * @param project an object representing a project
 */
export const validateProject = (project: any): ProjectModel => {
  return Joi.attempt(
    project,
    projectSchema.options({ stripUnknown: true })
  ) as ProjectModel;
};

type ProjectOptionMethods = Method.SYNC | Method.SELECT;

/**
 * Schema representing valid options for GET projects options
 */
const projectSelectOptionsSchema = Joi.object({
  syncToken: Joi.string()
    .trim()
    .custom(validateSyncToken)
    .optional()
    .alter({
      [Method.SYNC]: (schema) => schema.default("*").optional(),
      [Method.SELECT]: (schema) => schema.forbidden(),
    }),
  includeArchived: Joi.boolean()
    .optional()
    .alter({
      [Method.SYNC]: (schema) => schema.forbidden(),
      [Method.SELECT]: (schema) => schema.optional(),
    }),
});

/**
 * A map of schemas by method type
 */
const projectOptionsSchemas = new Map<ProjectOptionMethods, Schema>([
  [Method.SYNC, projectSelectOptionsSchema.unknown().tailor(Method.SYNC)],
  [Method.SELECT, projectSelectOptionsSchema.unknown().tailor(Method.SELECT)],
]);

/**
 * Validate project select options and set defaults
 * @param options - a ProjectSelectOptions-like object
 * @param method - a string representing the validation type to use, like "CREATE" or "PATCH"
 * @returns validated options
 */
export const validateProjectOptions = (
  options: any,
  method?: ProjectOptionMethods
): ProjectOptions => {
  options = camelcaseKeys(options);

  let schema: Schema = projectSelectOptionsSchema;

  if (method) {
    schema = projectOptionsSchemas.get(method) || schema;

    if (!schema) throw new InvalidMethodError(method);
  }

  return Joi.attempt(options, schema) as ProjectOptions;
};
