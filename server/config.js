/*     POSTGRESQL      */
const PG_USER = process.env.PG_USER || "pomi";
const PG_HOST = process.env.PG_HOST || "localhost";
const PG_DATABASE = process.env.PG_DATABASE || "pomi_dev";
const PG_PASSWORD = process.env.PG_PASSWORD || "root";
const PG_PORT = process.env.PG_PORT || 5432;

const PG_CONNECTION_DETAILS = {
  user: PG_USER,
  host: PG_HOST,
  database: PG_DATABASE,
  password: PG_PASSWORD,
  port: PG_PORT,
};

/*      EXPRESS SERVER      */
const PORT = process.env.PORT || 3000;

module.exports = {
  PG_CONNECTION_DETAILS,
  PORT,
};
