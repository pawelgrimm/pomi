import React from "react";
import MainLayout from "../layouts/MainLayout";
import TimerForm, { FormValues } from "@features/timer/TimerForm";

function TimerPage() {
  const initialValues: FormValues = {
    project: null,
    task: null,
    notes: "",
    startTimestamp: new Date(),
    type: "session",
  };
  return (
    <MainLayout>
      <TimerForm
        isInProgress={false}
        initialValues={initialValues}
        timerStartValue={10 * 60}
      />
    </MainLayout>
  );
}

export default TimerPage;
