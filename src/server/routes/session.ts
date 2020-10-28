import Router from "express-promise-router";
import { Sessions } from "../db";
import { validateClientSession } from "../../shared/validators";
import { convertDatabaseSessionModel } from "../../shared/models/session";
import { hydrateDatabaseSession } from "../../shared/validators/session";

const router = Router();

/*      NEW SESSION      */
router.post("/", async (req, res) => {
  try {
    const session = validateClientSession(req.body);
    const row = await Sessions.create(session);
    res.status(201).send(row);
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});

/*      GET ALL SESSIONS     */
router.get("/", async (req, res) => {
  const rows = await Sessions.selectAll();
  const sessions = rows.map((session) => convertDatabaseSessionModel(session));
  res.status(200).send(sessions);
});
/*      GET ALL OF TODAY'S SESSIONS     */
router.get("/today", async (req, res) => {
  const rows = await Sessions.selectAllToday();
  const sessions = rows.map((session) => hydrateDatabaseSession(session));
  res.status(200).send(sessions);
});

/*      GET SESSION BY ID    */
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const row = await Sessions.selectOneById(id);
  const session = hydrateDatabaseSession(row);
  res.status(200).send(session);
});

router.patch("/:id", async (req, res) => {
  const id = req.params.id;
  const session = validateClientSession(req.body, { isPartial: true });
  try {
    const success = await Sessions.update(id, session);
    res.status(200).send(success);
  } catch (e) {
    res.status(500).send(e);
  }
});

export default router;
