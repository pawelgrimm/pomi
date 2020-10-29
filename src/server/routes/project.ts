import Router from "express-promise-router";
import { Projects } from "../db";
import { validateProject } from "../../shared/validators";
import { authenticate } from "../middleware/authenticate";

const router = Router();

/*      NEW PROJECT      */
router.post("/", authenticate, async (req, res) => {
  const { userId: user_id } = res.locals;
  try {
    const project = validateProject({ user_id, ...req.body });
    const row = await Projects.create(project);
    res.status(201).send(row);
  } catch (e) {
    res.status(500).send();
  }
});

/*      GET ALL PROJECTS FOR USER     */
router.get("/", authenticate, async (req, res) => {
  const { userId } = res.locals;
  try {
    const rows = await Projects.selectAllByUser(userId);
    res.status(200).send(rows);
  } catch {
    res.status(500).send();
  }
});

/*      GET PROJECT BY ID    */
router.get("/:id", authenticate, async (req, res) => {
  const { userId } = res.locals;
  try {
    const id = Number.parseInt(req.params.id);
    const rows = await Projects.selectOneById(userId, id);
    res.status(200).send(rows);
  } catch {
    res.status(500).send();
  }
});

export default router;
