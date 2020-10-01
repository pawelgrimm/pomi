const bindQueries = (query) => {
  return {
    create: ({ username }) =>
      query("INSERT INTO users(username) VALUES ($1)", [username]).then(
        (res) => res.rows
      ),

    getAll: () =>
      query("SELECT id, username FROM users").then((res) => res.rows),

    getById: (id) =>
      query("SELECT id, username FROM users WHERE id = $1", [id]).then(
        (res) => res.rows
      ),
  };
};

module.exports = bindQueries;
