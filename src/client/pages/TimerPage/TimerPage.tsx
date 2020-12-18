import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import { ActionButton, TimerDisplay, TextField } from "../../components";
import { Tab, Tabs } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useAddSession } from "../../hooks";
import { SessionTypeString } from "../../../shared/types";
import { differenceInMilliseconds } from "date-fns";
import { FlexColumnContainer } from "../../components";
import { useHistory } from "react-router-dom";
import {
  ProjectField,
  ProjectOptionType,
} from "../../features/searchField/ProjectField";
import {
  TaskField,
  TaskOptionType,
} from "../../features/searchField/TaskField";

const timerStartValues = [60 * 25, 60 * 5, 60 * 15];

const sessionType: SessionTypeString[] = ["session", "break", "long_break"];

const useTabsStyles = makeStyles(
  {
    root: {
      marginBottom: "14px",
      minHeight: 0,
    },
  },
  { name: "MuiTabs" }
);

const useTabStyles = makeStyles(
  {
    root: {
      padding: 0,
      paddingBottom: "6px",
      minHeight: 0,
      minWidth: 0,
      textTransform: "none",
      fontSize: "1.1rem",
      fontWeight: "normal",
    },
    textColorPrimary: {
      color: "#3F3E3B",
    },
  },
  { name: "MuiTab" }
);

const LogoutPageButton: React.FC = () => {
  const history = useHistory();
  const onClick = () => history.push("/logout");
  return (
    <ActionButton variant="outlined" onClick={onClick}>
      Logout Page
    </ActionButton>
  );
};

interface FormValues {
  project: ProjectOptionType | null;
  task: TaskOptionType | null;
  notes: string;
  startTimestamp: string;
}

const TimerPage = () => {
  const [isInProgress, setInProgress] = useState(false);
  const [timerStartValue, setTimerStartValue] = useState(60 * 25);
  const [type, setType] = useState(0);
  const addSession = useAddSession();
  const tabsClasses = useTabsStyles();
  const tabClasses = useTabStyles();

  const initialValues: FormValues = {
    project: null,
    task: null,
    notes: "",
    startTimestamp: new Date().toISOString(),
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={(values, formikHelpers) => {
          if (!isInProgress) {
            formikHelpers.setFieldValue(
              "startTimestamp",
              new Date().toISOString()
            );
          } else {
            const session = {
              startTimestamp: values.startTimestamp,
              duration: differenceInMilliseconds(
                new Date(values.startTimestamp),
                new Date()
              ),
              notes: values.notes,
              type: sessionType[type],
            };

            console.log(
              "timer ended with values:",
              session,
              values.task,
              values.project
            );
            addSession({
              session,
              task: values.task,
              project: values.project,
            }).then((result) => {
              console.log(result);
            });
            setType((prev) => (prev === 0 ? 1 : 0));
          }
          setInProgress((prev) => !prev);
        }}
      >
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

export default TimerPage;
