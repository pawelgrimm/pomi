import Joi from "joi";

import { ProjectModel } from "../models";

const projectSchema = Joi.object({
  id: Joi.string().uuid({ version: "uuidv4" }).optional(),
  title: Joi.string().max(255).optional(),
  isArchived: Joi.boolean().optional(),
});

export const validateProject = (project: any): ProjectModel => {
  return Joi.attempt(
    project,
    projectSchema.options({
      stripUnknown: true,
    })
  ) as ProjectModel;
};
