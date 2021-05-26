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
import { ProjectModel, SessionTypeString } from "@types";
import { isNewOption } from "@features/search/OptionType";
import { useAddProject } from "@features/state/projectsSlice";
import { useAddTask } from "@features/state/tasksSlice";
import { differenceInSeconds } from "date-fns";

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
  const { timerStartValue, onSubmitHandler, initialValues } = props;

  const [isInProgress, setInProgress] = useState(false);

  const addProject = useAddProject();
  const addTask = useAddTask();

  const onSubmit: typeof onSubmitHandler =
    onSubmitHandler ??
    (async (formValues: FormValues, helpers) => {
      if (!isInProgress) {
        if (formValues.project == null || formValues.task == null) {
          console.log("Project or Task is null");
          return;
        }
        let project = formValues.project;
        if (isNewOption(formValues.project)) {
          await addProject(formValues.project, (newProject) => {
            project = newProject;
          });
        }
        let task = formValues.task;
        if (isNewOption(formValues.task)) {
          await addTask(
            {
              projectId: (project as ProjectModel).id,
              ...formValues.task,
            },
            (newTask) => {
              task = newTask;
            }
          );
        }
        helpers.setFieldValue("project", project);
        helpers.setFieldValue("task", task);
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
              <TaskField disabled={isInProgress} />
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
            <div>{JSON.stringify(values, undefined, "\t")}</div>
          </Form>
        )}
      </Formik>
    </>
  );
}

export default TimerForm;
