import React from "react";
import { Field, Form, Formik } from "formik";
import { ActionButton, FlexColumnContainer, TextField } from "@components";
import TimerDisplay from "./TimerDisplay";
import { FormikHelpers } from "formik/dist/types";
import { v4 as uuid } from "uuid";
import {
  ProjectField,
  TaskField,
  ProjectOptionType,
  TaskOptionType,
} from "@features/search";
import { ProjectModel, SessionTypeString } from "@types";
import { isNewOption } from "@features/search/OptionType";

export interface FormValues {
  project: ProjectOptionType | null;
  task: TaskOptionType | null;
  notes: string;
  startTimestamp: Date;
  type: SessionTypeString;
}
interface TimerFormProps {
  isInProgress: boolean;
  onSubmitHandler?: (
    values: FormValues,
    formikHelpers: FormikHelpers<FormValues>
  ) => Promise<any>;
  initialValues: FormValues;
  timerStartValue: number;
}

function TimerForm(props: TimerFormProps) {
  const {
    isInProgress,
    timerStartValue,
    onSubmitHandler,
    initialValues,
  } = props;

  const onSubmit: typeof onSubmitHandler =
    onSubmitHandler ??
    (async (formValues: FormValues, helpers) => {
      if (formValues.project == null || formValues.task == null) {
        console.log("Project or Task is null");
        return;
      }
      if (isNewOption(formValues.project)) {
        formValues.project = { ...formValues.project, id: uuid() };
      }
      if (isNewOption(formValues.task)) {
        formValues.task = {
          ...formValues.task,
          id: uuid(),
          projectId: (formValues.project as ProjectModel).id,
        };
      }
      console.log(formValues);
      return await Promise.resolve();
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
