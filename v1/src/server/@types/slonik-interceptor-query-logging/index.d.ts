declare module "slonik-interceptor-query-logging" {
  import { InterceptorType } from "slonik";

  type UserConfigurationType = {
    logValues?: boolean;
  };

  export function createQueryLoggingInterceptor(
    userConfiguration?: UserConfigurationType
  ): InterceptorType;
}
