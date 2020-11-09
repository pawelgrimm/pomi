import Joi from "joi";

import { ProjectModel } from "../types";

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
