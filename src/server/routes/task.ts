import Router from "express-promise-router";
import { Tasks } from "../db";
import { validateTask } from "../../shared/validators";

const router = Router();

/*      NEW TASK      */
router.post("/", async (req, res) => {
  try {
    const task = validateTask(req.body);
    const row = await Tasks.create(task);
    res.status(201).send(row);
  } catch (e) {
    res.status(500).send();
  }
});

/*      GET ALL TASKS     */
// TODO: Add return fields
router.get("/", async (req, res) => {
  const rows = await Tasks.selectAll();
  res.status(200).send(rows);
});

/*      GET TASK BY ID    */
// TODO: Add return fields
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const rows = await Tasks.selectOneById(id);
  res.status(200).send(rows);
});

export default router;