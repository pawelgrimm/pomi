import { UserModel } from "../models";

import Joi from "joi";

const userSchema = Joi.object({
  username: Joi.string().trim().min(3).max(30).required(),
  email: Joi.string().email({ tlds: false }).required(),
});

export const validateUser = (user: any): UserModel => {
  return Joi.attempt(user, userSchema) as UserModel;
};
