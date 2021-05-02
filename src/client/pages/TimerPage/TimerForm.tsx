import React from "react";
import { ProjectField } from "../../features/searchField/ProjectField";
import { TaskField } from "../../features/searchField/TaskField";
import { Field, Form, Formik } from "formik";
import {
  ActionButton,
  FlexColumnContainer,
  TextField,
  TimerDisplay,
} from "../../components";
import { LogoutPageButton } from "./LogoutPageButton";
import { Tab } from "@material-ui/core";
import { FormValues } from "./TimerPage";
import { FormikHelpers } from "formik/dist/types";
import { type } from "os";
import { TimerPageTabs } from "./TimerPageTabs";

interface TimerFormProps {
  isInProgress: boolean;
  timerStartValues: number[];
  onSubmitHandler: (
    values: FormValues,
    formikHelpers: FormikHelpers<FormValues>
  ) => void | Promise<any>;
  initialValues: FormValues;
  setTimerStartValue: React.Dispatch<React.SetStateAction<number>>;
  setType: React.Dispatch<React.SetStateAction<number>>;
  type: number;
}

const TimerForm: React.FC<TimerFormProps> = (props) => {
  const {
    isInProgress,
    timerStartValues,
    onSubmitHandler,
    initialValues,
    setTimerStartValue,
    type,
    setType,
  } = props;

  return (
    <>
      <Formik initialValues={initialValues} onSubmit={onSubmitHandler}>
        {({ submitForm, values }) => (
          <Form>
            <TimerPageTabs
              type={type}
              isInProgress={isInProgress}
              onChangeTabHandler={(value) => {
                if (isInProgress) {
                  submitForm().then(() => {
                    const timerType = value % 3;
                    const newTimerValue = timerStartValues[timerType];
                    setTimerStartValue(newTimerValue);
                    setType(timerType);
                  });
                } else {
                  const timerType = value % 3;
                  const newTimerValue = timerStartValues[timerType];
                  setTimerStartValue(newTimerValue);
                  setType(timerType);
                }
              }}
            />
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
                timerStartValue={timerStartValues[type]}
                isInProgress={isInProgress}
              />
              <ActionButton
                onClick={() => {
                  submitForm().then();
                }}
              >
                {isInProgress ? "Stop" : "Start"}
              </ActionButton>
              <LogoutPageButton />
            </FlexColumnContainer>
            <div>{JSON.stringify(values, undefined, "\t")}</div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default TimerForm;
