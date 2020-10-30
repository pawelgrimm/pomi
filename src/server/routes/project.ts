import Router from "express-promise-router";
import { Projects } from "../db";
import { validateProject } from "../../shared/validators";
import { authenticate } from "../middleware/authenticate";
import QueryString from "qs";

const router = Router();

const parseSelectAllOptions = (
  options: QueryString.ParsedQs
): { sync_token: string; include_archived: boolean } => {
  const { sync_token, include_archived } = options;
  return {
    sync_token: (sync_token && sync_token.toString()) || "*",
    include_archived: !!include_archived,
  };
};

/*      GET ALL PROJECTS FOR USER     */
router.get("/", authenticate, async (req, res) => {
  const { userId } = res.locals;
  const options = parseSelectAllOptions(req.query);
  try {
    const projects = await Projects.selectAll(userId, options);
    res.status(200).send({ projects });
  } catch {
    res.status(500).send();
  }
});

/*      GET PROJECT BY ID    */
router.get("/:id", authenticate, async (req, res) => {
  const { userId } = res.locals;
  const id = req.params.id;
  try {
    const project = await Projects.selectOneById(userId, id);
    res.status(200).send({ project });
  } catch {
    res.status(500).send();
  }
});

/*      NEW PROJECT      */
router.post("/", authenticate, async (req, res) => {
  const { userId } = res.locals;
  try {
    const project = await Projects.create(userId, validateProject(req.body));
    res.status(201).send({ project });
  } catch (e) {
    res.status(500).send();
  }
});

export default router;
