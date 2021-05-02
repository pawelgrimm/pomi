import { ValidationError } from "joi";
import { ParseOptionsError } from "../../errors";

export const convertValidatorErrorToParseOptionsError = (
  error: ValidationError
) => {
  const paths = error.details.map(({ path, message }) => {
    const name = path.join(", ");
    return { name, message };
  });
  throw new ParseOptionsError(paths);
};
