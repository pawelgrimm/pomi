import { Method, validateSessionOptions } from "../../../shared/validators";
import { createParseOptionsMiddleware } from "../shared/createParseOptionsMiddleware";

export const parseSyncOptions = createParseOptionsMiddleware((options) =>
  validateSessionOptions(options, Method.SYNC)
);

export const parseSelectOptions = createParseOptionsMiddleware((options) =>
  validateSessionOptions(options, Method.SELECT)
);
