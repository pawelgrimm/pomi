import React from "react";
import MainLayout from "@layouts/MainLayout";
import TimerForm from "../timer/components/TimerForm";

function TimerPage() {
  return (
    <MainLayout>
      <TimerForm />
    </MainLayout>
  );
}

export default TimerPage;
