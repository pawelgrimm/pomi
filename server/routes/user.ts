import Router from "express-promise-router";
import { users } from "../db";
import { validateUser, ValidationError } from "../validators";

const router = Router();

/*      NEW USER      */
router.post("/", async (req, res) => {
  try {
    const user = validateUser(req.body);
    const row = await users.create(user);
    res.status(201).send(row);
  } catch (e) {
    if (e instanceof ValidationError) {
      res.status(400).send({ errors: e.details.map((error) => error.message) });
    } else {
      res.status(500).send();
    }
  }
});

/*      GET ALL USERS     */
// TODO: Protect
router.get("/", async (req, res) => {
  const rows = await users.selectAll();
  res.status(200).send(rows);
});

/*      GET USER BY ID    */
// TODO: Protect
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const row = await users.selectOneById(id);
  res.status(200).send(row);
});

export default router;
