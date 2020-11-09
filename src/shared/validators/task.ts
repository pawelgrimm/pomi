import Joi from "joi";
import { TaskModel } from "../types";

const taskSchema = Joi.object({
  id: Joi.number().optional(),
});

export const validateTask = (
  task: any,
  options: { isPartial: boolean } = { isPartial: false }
): TaskModel => {
  return Joi.attempt(
    task,
    taskSchema.options({
      stripUnknown: true,
      presence: options.isPartial ? "optional" : "required",
    })
  ) as TaskModel;
};
