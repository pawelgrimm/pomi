import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import { ActionButton, TimerDisplay, TextField } from "../../components";
import { Tab, Tabs } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useAddSession } from "../../hooks";
import { SessionModel, SessionTypeString } from "../../../shared/types";
import { differenceInMilliseconds } from "date-fns";
import { SpacedContainer } from "../../components/SpacedContainer";
import { useHistory } from "react-router-dom";

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
              startTimestamp: values.startTimestamp.toISOString(),
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
            <SpacedContainer>
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

              <ActionButton
                onClick={() => {
                  submitForm().then();
                }}
              >
                {inProgress ? "Stop" : "Start"}
              </ActionButton>
              <LogoutPageButton />
            </SpacedContainer>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default TimerPage;
