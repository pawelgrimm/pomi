import Joi from "joi";
import { TaskOptions, TaskModel } from "../types";
import { Method } from "./shared";
import { validateSyncToken } from "../utils/models";
import { Schema } from "@hapi/joi";
import camelcaseKeys from "camelcase-keys";
import { InvalidMethodError } from "./errors";

/**
 * A Joi schema representing a TaskModel
 */
const taskSchema = Joi.object({
  id: Joi.string().uuid({ version: "uuidv4" }).optional(),
  projectId: Joi.string().uuid({ version: "uuidv4" }).optional(),
  title: Joi.string().max(255).optional(),
  isCompleted: Joi.boolean().optional(),
});

/**
 * Validate and parse an object into as a Talk
 * @param task an object representing a task
 */
export const validateTask = (task: any): TaskModel => {
  return Joi.attempt(
    task,
    taskSchema.options({ stripUnknown: true })
  ) as TaskModel;
};

type TaskOptionMethods = Method.SYNC | Method.SELECT;

/**
 * Schema representing valid options for GET tasks options
 */
const taskSelectOptionsSchema = Joi.object({
  syncToken: Joi.string()
    .trim()
    .custom(validateSyncToken)
    .optional()
    .alter({
      [Method.SYNC]: (schema) => schema.default("*").optional(),
      [Method.SELECT]: (schema) => schema.forbidden(),
    }),
  includeCompleted: Joi.boolean()
    .falsy(0, "0")
    .truthy(1, "1")
    .optional()
    .alter({
      [Method.SYNC]: (schema) => schema.forbidden(),
      [Method.SELECT]: (schema) => schema.optional(),
    }),
});

/**
 * A map of schemas by method type
 */
const taskOptionsSchemas = new Map<TaskOptionMethods, Schema>([
  [Method.SYNC, taskSelectOptionsSchema.unknown().tailor(Method.SYNC)],
  [Method.SELECT, taskSelectOptionsSchema.unknown().tailor(Method.SELECT)],
]);

/**
 * Validate task select options and set defaults
 * @param options - a TasSelectOptions-like object
 * @param method - a string representing the validation type to use, like "CREATE" or "PATCH"
 * @returns validated options
 */
export const validateTaskOptions = (
  options: any,
  method?: TaskOptionMethods
): TaskOptions => {
  options = camelcaseKeys(options);

  let schema: Schema = taskSelectOptionsSchema;

  if (method) {
    schema = taskOptionsSchemas.get(method) || schema;

    if (!schema) throw new InvalidMethodError(method);
  }

  return Joi.attempt(options, schema) as TaskOptions;
};
