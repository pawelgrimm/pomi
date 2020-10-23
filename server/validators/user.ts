import { UserParams } from "../../shared/models";

import Joi from "joi";

const userSchema = Joi.object({
  username: Joi.string().trim().min(3).max(30).required(),
  email: Joi.string().email().required(),
});

export const validateUser = (user: any): UserParams => {
  return Joi.attempt(user, userSchema) as UserParams;
};
