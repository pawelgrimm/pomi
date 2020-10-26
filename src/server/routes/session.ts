import Router from "express-promise-router";
import { sessions } from "../db";
// @ts-ignore
import { ClientSessionModel, DatabaseSessionModel } from "../../shared/models";
import { validateClientSession } from "../../shared/validators";
import { start } from "repl";

const router = Router();

const clientSessionParamsToDBCols = (
  session: ClientSessionModel
): DatabaseSessionModel => {
  const {
    startTimestamp,
    endTimestamp,
    description,
    retroAdded = false,
  } = session;
  return {
    start_timestamp: startTimestamp,
    duration: `${
      new Date(endTimestamp).valueOf() - new Date(startTimestamp).valueOf()
    } milliseconds`,
    description,
    retro_added: retroAdded,
  };
};

/*      NEW SESSION      */
router.post("/", async (req, res) => {
  try {
    const clientSession = validateClientSession(req.body);
    const session = clientSessionParamsToDBCols(clientSession);
    const row = await sessions.create(session);
    res.status(201).send(row);
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
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
