declare module "slonik-sql-tag-raw" {
  import {
    PrimitiveValueExpressionType,
    SqlSqlTokenType,
  } from "slonik/dist/types";

  export function raw(
    sql: string,
    values?: Readonly<PrimitiveValueExpressionType[]>
  ): SqlSqlTokenType;
}
