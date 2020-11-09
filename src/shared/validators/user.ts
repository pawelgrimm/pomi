import Joi from "joi";
import { UserModel } from "../types";

const userSchema = Joi.object({
  id: Joi.string().required().max(255),
  display_name: Joi.string().trim().max(255).required(),
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
