import React from "react";
import MainLayout from "../layouts/MainLayout";
import TimerDisplay from "../features/timer/TimerDisplay";

function TimerPage() {
  return (
    <MainLayout>
      <TimerDisplay timerStartValue={60 * 60} isInProgress={false} />
    </MainLayout>
  );
}

export default TimerPage;
