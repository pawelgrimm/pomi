import Router from "express-promise-router";
import { Projects, Sessions, Tasks, pool } from "../db";
import { authenticate, validationErrorHandler } from "../middleware";
import { parseSelectOptions, parseSyncOptions } from "../middleware/session";
import { DatabaseConnection } from "../db/slonik";

const router = Router();

router.use(authenticate);

const createNewTaskAndProjectIfNeeded = async (
  userId: string,
  body: any,
  transaction: DatabaseConnection
) => {
  const { project, task, session } = body;

  let newTask;
  let newProject;

  let taskId: string = session?.taskId || task?.id;
  if (!taskId && task?.title) {
    //We will need to create a task
    let projectId: string = task?.projectId || project?.id;
    if (!projectId && project?.title) {
      //Create a project
      newProject = await Projects.connect(transaction).create(userId, project);
      projectId = newProject.id;
    }
    newTask = await Tasks.connect(transaction).create(userId, {
      ...task,
      projectId,
    });
    taskId = newTask.id;
  }

  return { newTask, newProject, taskId };
};

/*      NEW SESSION      */
router.post("/", async ({ body }, res) => {
  const { userId } = res.locals;
  const { session } = body;

  // Determine if a new task (and project) are needed
  let newTask;
  let newProject;
  let newSession;
  await pool.connect(async (connection) => {
    await connection.transaction(async (transaction) => {
      let taskId;
      ({ newTask, newProject, taskId } = await createNewTaskAndProjectIfNeeded(
        userId,
        body,
        transaction
      ));
      newSession = await Sessions.connect(transaction).create(userId, {
        ...session,
        taskId,
      });
    });
  });

  res
    .status(201)
    .send({ session: newSession, task: newTask, project: newProject });
});

/*      GET ALL SESSIONS (SYNC)     */
router.get("/sync", parseSyncOptions, async (req, res) => {
  const { userId, options } = res.locals;
  const sessions = await Sessions.select(userId, options);

  let syncToken;
  if (sessions?.length > 0) {
    syncToken = sessions[0]?.lastModified?.toISOString();
  }

  res.status(sessions?.length > 0 ? 200 : 404).send({ sessions, syncToken });
});

/*      GET ALL SESSIONS     */
router.get("/", parseSelectOptions, async (req, res) => {
  const { userId, options } = res.locals;
  const sessions = await Sessions.select(userId, options);

  res.status(sessions.length > 0 ? 200 : 404).send({ sessions });
});

// TODO: implement
/*      GET ALL OF TODAY'S SESSIONS     */
router.get("/today", async (req, res) => {
  res.status(501).send();
  // const { userId } = res.locals;
  // const sessions = await Sessions.selectAllToday(userId);
  // res.status(sessions.length > 0 ? 200 : 404).send({ sessions });
});

/*      GET SESSION BY ID    */
router.get("/:id", async (req, res) => {
  const { userId } = res.locals;
  const sessionId = req.params.id;
  const session = await Sessions.selectOne(userId, sessionId);
  res.status(!!session ? 200 : 404).send({ session });
});

/*      UPDATE SESSION     */
router.patch("/:id", async (req, res) => {
  const { userId } = res.locals;
  const sessionId = req.params.id;
  const { session: updates } = req.body;

  // Determine if a new task (and project) are needed
  let newTask;
  let newProject;
  let newSession;
  await pool.connect(async (connection) => {
    await connection.transaction(async (transaction) => {
      let taskId;
      ({ newTask, newProject, taskId } = await createNewTaskAndProjectIfNeeded(
        userId,
        req.body,
        transaction
      ));
      newSession = await Sessions.connect(transaction).update(
        userId,
        sessionId,
        {
          ...updates,
          taskId,
        }
      );
    });
  });

  res
    .status(newSession ? 200 : 422)
    .send({ session: newSession, task: newTask, project: newProject });
});

router.use(validationErrorHandler);

export default router;
