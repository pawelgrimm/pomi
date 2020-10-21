const Router = require("express-promise-router");

const { sessions } = require("../db");

const router = new Router();

module.exports = router;

/*      NEW SESSION      */
// TODO: Add creation fields
router.post("/", async (req, res) => {
  const { start_timestamp, duration, description, retro_added } = req.body;
  const rows = await sessions.create({
    start_timestamp,
    duration,
    description,
    retro_added,
  });
  res.status(201).send(rows);
});

/*      GET ALL SESSIONS     */
// TODO: Add return fields
router.get("/", async (req, res) => {
  const rows = await sessions.getAll();
  res.status(200).send(rows);
});

/*      GET SESSION BY ID    */
// TODO: Add return fields
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const rows = await sessions.getById(id);
  res.status(200).send(rows);
});
