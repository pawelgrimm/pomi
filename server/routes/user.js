const Router = require("express-promise-router");

const { users } = require("../db");

const router = new Router();

module.exports = router;

/*      NEW USER      */
router.post("/", async (req, res) => {
  const { username } = req.body;
  const rows = await users.create({ username });
  res.status(201).send(rows);
});

/*      GET ALL USERS     */
// TODO: Protect
router.get("/", async (req, res) => {
  const rows = await users.getAll();
  console.log(rows);
  res.status(200).send(rows);
});

/*      GET USER BY ID    */
// TODO: Protect
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const rows = await users.getById(id);
  res.status(200).send(rows);
});
