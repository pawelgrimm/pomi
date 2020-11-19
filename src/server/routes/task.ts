import Router from "express-promise-router";
import { authenticate, validationErrorHandler } from "../middleware";
import { parseSelectOptions } from "../middleware/task";
import { Tasks } from "../db";
import { validateTask } from "../../shared/validators";

const router = Router();

router.use(authenticate);

/*      NEW TASK      */
router.post("/", async (req, res) => {
  const { userId } = res.locals;
  const task = await Tasks.create(userId, validateTask(req.body));
  res.status(201).send({ task });
});

/*      GET ALL TASKS     */
router.get("/", parseSelectOptions, async (req, res) => {
  const { userId, options } = res.locals;
  const tasks = await Tasks.select(userId, options);

  res.status(tasks.length > 0 ? 200 : 404).send({ tasks });
});

/*      GET TASK BY ID    */
router.get("/:id", async (req, res) => {
  const { userId } = res.locals;
  const id = req.params.id;
  const task = await Tasks.selectOne(userId, id);

  res.status(task ? 200 : 404).send({ task });
});

router.use(validationErrorHandler);

export default router;
