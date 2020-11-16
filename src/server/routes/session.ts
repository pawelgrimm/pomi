import Router from "express-promise-router";
import { Projects, Sessions, Tasks, pool } from "../db";
import { authenticate, validationErrorHandler } from "../middleware";

const router = Router();

router.use(authenticate);

/*      NEW SESSION      */
router.post("/", async ({ body }, res) => {
  const { userId } = res.locals;
  const { project, task, session } = body;

  // Determine if a task was provided
  let newTask;
  let newProject;
  let newSession;
  await pool.connect(async (connection) => {
    await connection.transaction(async (transaction) => {
      let taskId: string = session.taskId || task?.id;
      if (!taskId && task?.title) {
        //We will need to create a task
        let projectId: string = task?.projectId || project?.id;
        if (!projectId && project?.title) {
          //Create a project
          newProject = await Projects.connect(transaction).create(
            userId,
            project
          );
          projectId = newProject.id;
        }
        newTask = await Tasks.connect(transaction).create(userId, {
          ...task,
          projectId,
        });
        taskId = newTask.id;
      }
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

/*      GET ALL SESSIONS     */
router.get("/", async (req, res) => {
  const { userId } = res.locals;
  const sessions = await Sessions.select(userId);
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

router.patch("/:id", async (req, res) => {
  const { userId } = res.locals;
  const sessionId = req.params.id;
  const session = req.body;
  const success = await Sessions.update(userId, sessionId, session);
  res.status(success ? 200 : 422).send();
});

router.use(validationErrorHandler);

export default router;
