const Router = require("express-promise-router");

const { sessions } = require("../db");

const router = new Router();

module.exports = router;

const clientSessionParamsToDBCols = ({
  startTimestamp,
  endTimestamp,
  description,
  retro_added = false,
}) => {
  return {
    start_timestamp: new Date(startTimestamp * 1000),
    duration: endTimestamp - startTimestamp,
    description,
    retro_added,
  };
};

/*      NEW SESSION      */
router.post("/", async (req, res) => {
  const session = clientSessionParamsToDBCols(req.body);
  const row = await sessions.create(session);
  res.status(201).send(row);
});

/*      GET ALL SESSIONS     */
router.get("/", async (req, res) => {
  const rows = await sessions.selectAll();
  res.status(200).send(rows);
});

/*      GET SESSION BY ID    */
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const rows = await sessions.selectOneById(id);
  res.status(200).send(rows);
});

router.patch("/:id", async (req, res) => {
  const id = req.params.id;
  const session = clientSessionParamsToDBCols(req.body);
  try {
    const success = await sessions.update(id, session);
    res.status(200).send(success);
  } catch (e) {
    res.status(500).send(e);
  }
});
