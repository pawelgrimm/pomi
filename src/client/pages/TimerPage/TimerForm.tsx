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
import { Tab, Tabs } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { FormValues } from "./TimerPage";
import { FormikHelpers } from "formik/dist/types";

interface TimerFormProps {
  isInProgress: boolean;
  timerStartValue: number;
  onSubmitHandler: (
    values: FormValues,
    formikHelpers: FormikHelpers<FormValues>
  ) => void | Promise<any>;
  initialValues: FormValues;
}

const TimerForm: React.FC<TimerFormProps> = (props) => {
  const {
    isInProgress,
    timerStartValue,
    onSubmitHandler,
    initialValues,
  } = props;
  const tabsClasses = useTabsStyles();
  const tabClasses = useTabStyles();

  return (
    <>
      <Formik initialValues={initialValues} onSubmit={onSubmitHandler}>
        {({ submitForm, values }) => (
          <Form>
            <Tabs
              classes={tabsClasses}
              value={type}
              onChange={(event, value) => {
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
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
            >
              <Tab label="Session" classes={tabClasses} />
              <Tab label="Break" classes={tabClasses} />
              <Tab label="Long Break" classes={tabClasses} />
            </Tabs>
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
