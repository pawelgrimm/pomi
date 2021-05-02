import path from "path";
// @ts-ignore
import { config } from "dotenv-defaults";

const ENV_FILES_DIRECTORY = ".";

export const getEnvPath = (environment: string) => {
  const env = environment.toLowerCase();
  let fileName = "defaults";
  if (env === "dev" || env === "development") {
    fileName = "development";
  } else if (env === "test") {
    fileName = "test";
  } else if (env === "defaults") {
    fileName = "defaults";
  }
  return path.join(__dirname, ENV_FILES_DIRECTORY, `.env.${fileName}`);
};

if (process.env.NODE_ENV === "test") {
  config({
    path: getEnvPath("test"),
    defaults: getEnvPath("defaults"),
  });
}

const PG_CONNECTION_STRING = process.env.DATABASE_URL || "";
const PORT = process.env.PORT || "";

export { PG_CONNECTION_STRING, PORT };
