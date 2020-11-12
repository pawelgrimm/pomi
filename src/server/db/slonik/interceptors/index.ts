import { createFieldNameTransformationInterceptor } from "slonik-interceptor-field-name-transformation";
import { createQueryLoggingInterceptor } from "slonik-interceptor-query-logging";

export const createInterceptors = () => [
  createFieldNameTransformationInterceptor({
    format: "CAMEL_CASE",
  }),
  createQueryLoggingInterceptor(),
];
