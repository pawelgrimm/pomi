import Joi from "joi";
import { TaskModel } from "../types";

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
