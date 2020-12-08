import { validateTaskOptions } from "../../../shared/validators";
import { createParseOptionsMiddleware } from "../shared/createParseOptionsMiddleware";

export const parseSelectOptions = createParseOptionsMiddleware((options) =>
  validateTaskOptions(options)
);
