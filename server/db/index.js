const { Pool } = require("pg");
const { PG_CONNECTION_DETAILS } = require("../config/config");

const pool = new Pool(PG_CONNECTION_DETAILS);

const query = (text, params) => pool.query(text, params);

module.exports = {
  query,
};
