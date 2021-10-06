import React, { useState } from "react";
import { Field, Form, Formik } from "formik";
import { ActionButton, FlexColumnContainer, TextField } from "@components";
import TimerDisplay from "./TimerDisplay";
import { FormikHelpers } from "formik/dist/types";
import {
  ProjectField,
  TaskField,
  ProjectOptionType,
  TaskOptionType,
} from "@features/search";
import { SessionTypeString } from "@types";
import { isNewOption } from "@features/search/OptionType";
import { useAddTask } from "@features/state/tasksSlice";
import { differenceInSeconds } from "date-fns";
import { useSelector } from "react-redux";
import { RootState } from "@app/rootReducer";
import { useAddProject } from "@features/state/projectsSlice";

export interface FormValues {
  project: ProjectOptionType | null;
  task: TaskOptionType | null;
  notes: string;
  startTimestamp: Date;
  type: SessionTypeString;
}
interface TimerFormProps {
  onSubmitHandler?: (
    values: FormValues,
    formikHelpers: FormikHelpers<FormValues>
  ) => Promise<any>;
  initialValues: FormValues;
  timerStartValue: number;
}

function TimerForm(props: TimerFormProps) {
  const projects = useSelector((state: RootState) => state.projects.data);
  // const tasks = useSelector((state: RootState) => state.tasks.data);
  const { timerStartValue, onSubmitHandler, initialValues } = props;

  const [isInProgress, setInProgress] = useState(false);

  const addProject = useAddProject();
  // const addTask = useAddTask();

  const onSubmit: typeof onSubmitHandler =
    onSubmitHandler ??
    (async (formValues: FormValues, helpers) => {
      if (!isInProgress) {
        // if (formValues.project == null || formValues.task == null) {
        //   console.log("Project or Task is null");
        //   return;
        // }
        let project = formValues.project;
        if (isNewOption(formValues.project)) {
          await addProject(formValues.project, (newProject) => {
            project = newProject;
          });
        }
        // let task = formValues.task;
        // if (isNewOption(formValues.task)) {
        //   await addTask(
        //     {
        //       projectId: (project as ProjectModel).id,
        //       ...formValues.task,
        //     },
        //     (newTask) => {
        //       task = newTask;
        //     }
        //   );
        // }
        helpers.setFieldValue("project", project);
        // helpers.setFieldValue("task", task);
        setInProgress(true);
      } else {
        setInProgress(false);
        console.log(
          "elapsed time",
          differenceInSeconds(new Date(), formValues.startTimestamp)
        );
      }
    });

  return (
    <>
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        {({ submitForm, values }) => (
          <Form>
            <FlexColumnContainer>
              <ProjectField disabled={isInProgress} />
              {/* <TaskField disabled={isInProgress} /> */}
              <Field
                component={TextField}
                multiline
                name="notes"
                type="text"
                label="Notes"
                disabled={false}
              />
              <TimerDisplay
                timerStartValue={timerStartValue}
                isInProgress={isInProgress}
              />
              <ActionButton
                onClick={() => {
                  submitForm().catch(() => {});
                }}
              >
                {isInProgress ? "Stop" : "Start"}
              </ActionButton>
            </FlexColumnContainer>
            <div>
              <h3>Form Values</h3>
              <p>{JSON.stringify(values, undefined, "\t")}</p>
            </div>
            <div>
              <h3>Projects</h3>
              <p>{JSON.stringify(projects, undefined, "\t")}</p>
            </div>
            {/* <div> */}
            {/*  <h3>Tasks</h3> */}
            {/*  <p>{JSON.stringify(tasks, undefined, "\t")}</p> */}
            {/* </div> */}
          </Form>
        )}
      </Formik>
    </>
  );
}

export default TimerForm;
