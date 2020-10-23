import * as path from "path";
import dotenv from "dotenv";
import debug from "debug";

const logger = debug("config");

const env = process.env.NODE_ENV || "development";
const configPath = path.join(__dirname, `./.env.${env}`);

logger(`Loading configuration for ${env} from ${configPath}`);
dotenv.config({ path: configPath });

/*     POSTGRESQL      */
const PG_USER = process.env.PG_USER || "pomi";
const PG_HOST = process.env.PG_HOST || "localhost";
const PG_DATABASE = process.env.PG_DATABASE || "pomi_dev";
const PG_PASSWORD = process.env.PG_PASSWORD || "root";
const PG_PORT = process.env.PG_PORT || 5432;

const PG_CONNECTION_STRING =
  process.env.DATABASE_URL ||
  `postgresql://${PG_USER}:${PG_PASSWORD}@${PG_HOST}:${PG_PORT}/${PG_DATABASE}`;

/*      EXPRESS SERVER      */
const PORT = process.env.PORT || 3000;

export { PG_CONNECTION_STRING, PORT };
