import React from "react";
import MainLayout from "@layouts/MainLayout";
import { TimerForm } from "@features/timer";

function TimerPage() {
  return (
    <MainLayout>
      <TimerForm />
    </MainLayout>
  );
}

export default TimerPage;
