declare module "slonik-interceptor-field-name-transformation" {
  import { FieldType } from "slonik";

  export function createFieldNameTransformationInterceptor(options: {
    format: "CAMEL_CASE";
    test?: (field: FieldType) => boolean;
  });
}
