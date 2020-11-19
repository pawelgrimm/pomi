import { validateProjectOptions } from "../../../shared/validators";
import { createParseOptionsMiddleware } from "../shared/createParseOptionsMiddleware";

export const parseSelectOptions = createParseOptionsMiddleware((options) =>
  validateProjectOptions(options)
);
