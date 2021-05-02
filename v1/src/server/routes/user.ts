import Router from "express-promise-router";
import * as admin from "firebase-admin";
import { Projects, Sessions, Tasks, Users } from "../db";
import { authenticate, parseAuthHeader, parseSyncOptions } from "../middleware";
import { SyncOptions } from "../../shared/types";
import { createSyncToken } from "../../shared/utils";

const router = Router();

/*      LOGIN + SYNC APP DB to FIREBASE DB     */
router.post("/login", parseAuthHeader, async (req, res) => {
  const firebaseId: string = res.locals.firebaseId;
  const user = await Users.getByFirebaseId(firebaseId);

  if (user) {
    // TODO: Update app DB with user's email and displayName
    res.status(200).send();
  } else {
    try {
      const { displayName, email } = await admin.auth().getUser(firebaseId);
      await Users.create({
        displayName: displayName || "User",
        email: email || "",
        firebaseId,
      });
      res.status(201).send();
    } catch (err) {
      res.status(500).send();
    }
  }
});

router.use(authenticate);

/*      GET USER INFO    */
router.get("/", async (req, res) => {
  const { userId } = res.locals as { userId: string };

  const user = await Users.selectOne(userId);

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
