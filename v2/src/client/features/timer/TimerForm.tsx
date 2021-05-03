import React from "react";
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

export interface FormValues {
  project: ProjectOptionType | null;
  task: TaskOptionType | null;
  notes: string;
  startTimestamp: Date;
  type: SessionTypeString;
}
interface TimerFormProps {
  isInProgress: boolean;
  onSubmitHandler: (
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

  return (
    <>
      <Formik initialValues={initialValues} onSubmit={onSubmitHandler}>
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
