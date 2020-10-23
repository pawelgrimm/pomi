import { SessionParamsClient } from "../models";

import Joi from "joi";

const sessionSchema = Joi.object({
  startTimestamp: Joi.date().iso().required(),
  endTimestamp: Joi.date().iso().required(),
  description: Joi.string().optional(),
  retro_added: Joi.boolean().optional(),
});

export const validateSession = (session: any): SessionParamsClient => {
  return Joi.attempt(session, sessionSchema) as SessionParamsClient;
};
