const Router = require("express-promise-router");

const { sessions } = require("../db");

const router = new Router();

module.exports = router;

const clientSessionParamsToDBCols = ({
  startTimestamp,
  endTimestamp,
  description,
}) => {
  return {
    start_timestamp: startTimestamp,
    duration: endTimestamp - startTimestamp,
    description,
    retro_added: false,
  };
};

/*      NEW SESSION      */
// TODO: Add creation fields
router.post("/", async (req, res) => {
  const session = clientSessionParamsToDBCols(req.body);
  const rows = await sessions.create(session);
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

router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const session = clientSessionParamsToDBCols(req.body);
  try {
    const success = await sessions.put(id, session);
    res.status(200).send(success);
  } catch (e) {
    res.status(500).send(e);
  }
});
