import Joi from "joi";
import { UserModel } from "../models";

const userSchema = Joi.object({
  id: Joi.string().required().max(255),
  username: Joi.string().trim().min(3).max(30).required(),
  email: Joi.string().email({ tlds: false }).max(255).required(),
});

export const validateUser = (user: any): UserModel => {
  return Joi.attempt(
    user,
    userSchema.options({
      stripUnknown: true,
    })
  ) as UserModel;
};
