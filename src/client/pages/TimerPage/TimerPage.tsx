import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import { ActionButton, TimerDisplay, TextField } from "../../components";
import { ButtonGroup, Tab, Tabs } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useAddSession } from "../../hooks";
import { SessionModel, SessionTypeString } from "../../../shared/types";
import { differenceInMilliseconds } from "date-fns";

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

const TimerPage = () => {
  const [inProgress, setInProgress] = useState(false);
  const [timerStartValue, setTimerStartValue] = useState(60 * 25);
  const [type, setType] = useState(0);

  const addSession = useAddSession();

  const tabsClasses = useTabsStyles();
  const tabClasses = useTabStyles();
  return (
    <>
      <Formik
        initialValues={{
          project: "",
          task: "",
          notes: "",
          startTimestamp: new Date(),
        }}
        onSubmit={(values, formikHelpers) => {
          if (!inProgress) {
            console.log("timer started");
            formikHelpers.setFieldValue("startTimestamp", new Date());
          } else {
            const session: SessionModel = {
              startTimestamp: values.startTimestamp,
              taskId: values.task,
              duration: differenceInMilliseconds(
                values.startTimestamp,
                new Date()
              ),
              type: sessionType[type],
            };
            console.log("timer ended with values:", session);
            addSession(session);
            setType((prev) => (prev === 0 ? 1 : 0));
          }
          setInProgress((prev) => !prev);
        }}
      >
        {({ submitForm }) => (
          <Form>
            <Tabs
              classes={tabsClasses}
              value={type}
              onChange={(event, value) => {
                console.log(value);
                if (inProgress) {
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
            <Field
              component={TextField}
              name="project"
              type="text"
              label="Project"
              disabled={inProgress}
            />
            <Field
              component={TextField}
              name="task"
              type="text"
              label="Task"
              disabled={inProgress}
            />
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
              isInProgress={inProgress}
            />
            <ButtonGroup fullWidth orientation="vertical">
              <ActionButton
                onClick={() => {
                  submitForm().then();
                }}
              >
                {inProgress ? "Stop" : "Start"}
              </ActionButton>
            </ButtonGroup>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default TimerPage;
