declare module "slonik-sql-tag-raw" {
  import { PrimitiveValueExpressionType } from "slonik/dist/types";

  export function raw(
    sql: string,
    values?: $ReadOnlyArray<PrimitiveValueExpressionType>
  ): RawSqlTokenType;
}
