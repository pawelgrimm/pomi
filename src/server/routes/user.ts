import Router from "express-promise-router";
import { Projects, Sessions, Tasks, Users } from "../db";
import { validateUser, ValidationError } from "../../shared/validators";
import { parseSyncOptions } from "../middleware";
import {
  ProjectModel,
  SessionModel,
  TaskModel,
  SyncOptions,
} from "../../shared/types";
import { Task } from "../db/models";

const router = Router();

/*      NEW USER      */
router.post("/", async (req, res) => {
  try {
    const user = validateUser(req.body);
    const row = await Users.create(user);
    res.status(201).send(row);
  } catch (e) {
    if (e instanceof ValidationError) {
      res.status(400).send({ errors: e.details.map((error) => error.message) });
    } else {
      res.status(500).send();
    }
  }
});

/*      GET USER BY ID    */
// TODO: Protect
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const row = await Users.selectOneById(id);
  res.status(200).send(row);
});

const createSyncToken = (
  results: [
    readonly Required<SessionModel>[],
    readonly Required<TaskModel>[],
    readonly Required<ProjectModel>[]
  ]
) => {
  const lastModified = Math.max(
    ...results.map((model) =>
      model.length > 0 ? model[0].lastModified.valueOf() : 0
    )
  );
  return lastModified > 0 ? new Date(lastModified).toISOString() : null;
};

interface SyncResLocals {
  userId: string;
  options: SyncOptions;
}

router.get("/sync", parseSyncOptions, async (req, res) => {
  const { userId, options } = res.locals as SyncResLocals;

  const results = await Promise.all([
    Sessions.select(userId, options),
    Tasks.select(userId, options),
    Projects.select(userId, options),
  ]);

  const syncToken = createSyncToken(results);

  const [sessions, tasks, projects] = results;

  return {
    syncToken,
    sessions,
    tasks,
    projects,
  };
});

export default router;
