import Router from "express-promise-router";
import { sessions } from "../db";
// @ts-ignore
import { SessionParamsRaw } from "../../src/models/session";

const router = Router();

const clientSessionParamsToDBCols = ({
  startTimestamp,
  endTimestamp,
  description,
  retro_added = false,
}: SessionParamsRaw) => {
  return {
    start_timestamp: startTimestamp,
    duration: endTimestamp - startTimestamp,
    description,
    retro_added,
  };
};

/*      NEW SESSION      */
router.post("/", async (req, res) => {
  const session = clientSessionParamsToDBCols(req.body);
  console.log(session);
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

export default router;
