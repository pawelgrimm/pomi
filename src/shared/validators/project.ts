import Joi from "joi";

import { ProjectModel } from "../models";

const projectSchema = Joi.object({
  id: Joi.number().optional(),
  user_id: Joi.string().max(255),
  title: Joi.string().max(255).optional(),
});

export const validateProject = (
  project: any,
  options: { isPartial: boolean } = { isPartial: false }
): ProjectModel => {
  return Joi.attempt(
    project,
    projectSchema.options({
      stripUnknown: true,
      presence: options.isPartial ? "optional" : "required",
    })
  ) as ProjectModel;
};
