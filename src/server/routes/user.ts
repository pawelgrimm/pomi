import Router from "express-promise-router";
import { Projects, Sessions, Tasks, Users } from "../db";
import { validateUser, ValidationError } from "../../shared/validators";
import { authenticate, parseSyncOptions } from "../middleware";
import { SyncOptions } from "../../shared/types";
import { createSyncToken } from "../../shared/utils/models";

const router = Router();

/*      NEW USER      */
// TODO: This one is probably not necessary -> new user creation will be handled in server via Firebase Auth
router.post("/", async (req, res) => {
  res.status(501).send();
  // try {
  //   const user = validateUser(req.body);
  //   const row = await Users.create(user);
  //   res.status(201).send(row);
  // } catch (e) {
  //   if (e instanceof ValidationError) {
  //     res.status(400).send({ errors: e.details.map((error) => error.message) });
  //   } else {
  //     res.status(500).send();
  //   }
  // }
});

router.use(authenticate);

/*      GET USER INFO    */
router.get("/", async (req, res) => {
  const { userId } = res.locals as { userId: string };

  const user = await Users.selectOneById(userId);
  res.status(200).send({ user });
});

interface SyncResLocals {
  userId: string;
  options: SyncOptions;
}

/*      SYNC USER     */
router.get("/sync", parseSyncOptions, async (req, res) => {
  const { userId, options } = res.locals as SyncResLocals;

  const results = await Promise.all([
    Sessions.select(userId, options),
    Tasks.select(userId, options),
    Projects.select(userId, options),
  ]);
  const [sessions, tasks, projects] = results;

  const syncToken = createSyncToken(results, options.syncToken);

  res.status(200).send({
    syncToken,
    sessions,
    tasks,
    projects,
  });
});

export default router;
