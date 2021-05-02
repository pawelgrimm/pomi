import React, { useState } from "react";
import { useAddSession } from "../../hooks";
import { SessionTypeString } from "../../../shared/types";
import { differenceInMilliseconds } from "date-fns";
import { ProjectOptionType } from "../../features/searchField/ProjectField";
import { TaskOptionType } from "../../features/searchField/TaskField";
import {
  NewProjectParams,
  NewSessionParams,
  NewTaskParams,
} from "../../services/session/session";
import { isNewOption } from "../../features/searchField/OptionType";
import TimerForm from "./TimerForm";
import { FormikHelpers } from "formik/dist/types";

const timerStartValues = [60 * 25, 60 * 5, 60 * 15];

const sessionType: SessionTypeString[] = ["session", "break", "long_break"];

export interface FormValues {
  project: ProjectOptionType | null;
  task: TaskOptionType | null;
  notes: string;
  startTimestamp: Date;
  type: SessionTypeString;
}

const TimerPage = () => {
  const [isInProgress, setInProgress] = useState(false);
  const [timerStartValue, setTimerStartValue] = useState(60 * 25);
  const [type, setType] = useState(0);
  const addSession = useAddSession();

  const initialValues: FormValues = {
    project: null,
    task: null,
    notes: "",
    startTimestamp: new Date(),
    type: sessionType[type],
  };

  const onSubmitHandler = (
    values: FormValues,
    formikHelpers: FormikHelpers<FormValues>
  ) => {
    if (!isInProgress) {
      // Reset the startTimestamp if we just started the timer
      formikHelpers.setFieldValue("startTimestamp", new Date());
      formikHelpers.setFieldValue("type", sessionType[type]);
    } else {
      // Send the completed sessions to the server if we just stopped the timer
      const {
        sessionParams,
        taskParams,
        projectParams,
      } = createNewSessionParams(values);
      addSession({
        session: sessionParams,
        task: taskParams,
        project: projectParams,
      }).then(({ task: newTask, project: newProject }) => {
        if (newProject) {
          formikHelpers.setFieldValue("project", newProject);
        }
        if (newTask) {
          formikHelpers.setFieldValue("task", newTask);
        }
      });
      setType((prev) => (prev === 0 ? 1 : 0));
    }
    setInProgress((prev) => !prev);
  };

  return (
    <TimerForm
      isInProgress={isInProgress}
      timerStartValues={timerStartValues}
      onSubmitHandler={onSubmitHandler}
      initialValues={initialValues}
      setTimerStartValue={setTimerStartValue}
      setType={setType}
      type={type}
    />
  );
};

function createNewSessionParams(values: FormValues) {
  const { startTimestamp, notes, type, task, project } = values;
  const sessionParams: NewSessionParams = {
    startTimestamp: startTimestamp.toISOString(),
    duration: differenceInMilliseconds(new Date(), startTimestamp),
    notes,
    type,
  };
  const taskParams = optionAsValidTaskParams(task);
  const projectParams = optionAsValidProjectParams(project);
  return { sessionParams, taskParams, projectParams };
}

function optionAsValidTaskParams(
  option: TaskOptionType | null
): NewTaskParams | null {
  return isNewOption(option) ? { title: option.inputValue } : option;
}

function optionAsValidProjectParams(
  option: ProjectOptionType | null
): NewProjectParams | null {
  return isNewOption(option) ? { title: option.inputValue } : option;
}

export default TimerPage;
