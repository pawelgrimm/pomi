import Router from "express-promise-router";
import { users } from "../db";

const router = Router();

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
  res.status(200).send(rows);
});

/*      GET USER BY ID    */
// TODO: Protect
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const rows = await users.getById(id);
  res.status(200).send(rows);
});

export default router;
