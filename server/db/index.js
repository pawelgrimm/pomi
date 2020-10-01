const { Pool } = require("pg");
const { PG_CONNECTION_STRING } = require("../config/config");

const pool = new Pool({ connectionString: PG_CONNECTION_STRING });

const close = () => pool.end();

const query = (text, params) => pool.query(text, params);

const bindUserQueries = require("./queries/users");
const users = bindUserQueries(query);

module.exports = {
  query,
  users,
  close,
};
