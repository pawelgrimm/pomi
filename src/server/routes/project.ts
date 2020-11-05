import Router from "express-promise-router";
import {
  authenticate,
  parseOptions,
  validationErrorHandler,
} from "../middleware";
import { Projects } from "../db";
import { validateProject } from "../../shared/validators";

const router = Router();

router.use(authenticate);

/*      NEW PROJECT      */
router.post("/", async (req, res) => {
  const { userId } = res.locals;
  const project = await Projects.create(userId, validateProject(req.body));
  res.status(201).send({ project });
});

/*      GET ALL PROJECTS FOR USER     */
router.get("/", parseOptions, async (req, res) => {
  const { userId, options } = res.locals;
  const projects = await Projects.select(userId, options);

  res.status(projects.length > 0 ? 200 : 404).send({ projects });
});

/*      GET PROJECT BY ID    */
router.get("/:id", async (req, res) => {
  const { userId } = res.locals;
  const id = req.params.id;
  const project = await Projects.selectOne(userId, id);

  res.status(project ? 200 : 404).send({ project });
});

router.use(validationErrorHandler);

export default router;
