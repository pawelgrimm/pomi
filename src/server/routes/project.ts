import Router from "express-promise-router";
import QueryString from "qs";
import { authenticate, validationErrorHandler } from "../middleware";
import { Projects } from "../db";
import { SelectOptions } from "../db/queries";
import { validateProject } from "../../shared/validators";

const router = Router();

const parseSelectAllOptions = (
  options: QueryString.ParsedQs
): SelectOptions => {
  const { sync_token, include_archived } = options;
  return {
    syncToken: (sync_token && sync_token.toString()) || "*",
    includeArchived: !!include_archived,
  };
};

router.use(authenticate);

/*      NEW PROJECT      */
router.post("/", async (req, res) => {
  const { userId } = res.locals;
  const project = await Projects.create(userId, validateProject(req.body));
  res.status(201).send({ project });
});

/*      GET ALL PROJECTS FOR USER     */
router.get("/", async (req, res) => {
  const { userId } = res.locals;
  const options = parseSelectAllOptions(req.query);
  try {
    const projects = await Projects.select(userId, options);
    res.status(200).send({ projects });
  } catch {
    res.status(500).send();
  }
});

/*      GET PROJECT BY ID    */
router.get("/:id", async (req, res) => {
  const { userId } = res.locals;
  const id = req.params.id;
  try {
    const project = await Projects.selectOne(userId, id);
    res.status(200).send({ project });
  } catch {
    res.status(500).send();
  }
});

router.use(validationErrorHandler);

export default router;
