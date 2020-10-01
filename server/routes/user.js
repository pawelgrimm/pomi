const Router = require("express-promise-router");

const db = require("../db");

const router = new Router();

module.exports = router;

/*      NEW USER      */
router.post("/", async (req, res) => {
  const { username } = req.body;
  const { rows } = await db.query("INSERT INTO users(username) VALUES ($1)", [
    username,
  ]);
  res.status(201).send(rows);
});

/*      GET ALL USERS     */
// TODO: Protect
router.get("/", async (req, res) => {
  const { rows } = await db.query("SELECT id, username FROM users");
  res.status(200).send(rows);
});

/*      GET USER BY ID    */
// TODO: Protect
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const {
    rows,
  } = await db.query("SELECT id, username FROM users WHERE id = $1", [id]);
  res.status(200).send(rows);
});
