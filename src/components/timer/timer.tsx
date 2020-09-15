import React, { useEffect, useState } from "react";
import { useTimeKeeper } from "../timekeeper/timekeeper";
import {
  ProjectSearch,
  PrimaryButton,
  SecondaryButton,
  TimerDisplay,
} from "../index";

const Timer = () => {
  const [time, setTime] = useState<number>(15 * 60);
  // const [sessionStart, setSessionStart] = useState<number>(0);
  const [inProgress, setInProgress] = useState<boolean>(false);
  const [clock, startTimer, pauseTimer] = useTimeKeeper();

  useEffect(() => {
    if (inProgress) {
      setTime((prev) => prev - 1);
    }
  }, [clock, inProgress]);

  useEffect(() => {});

  const onStartStopClick = () => {
    if (inProgress) {
      setTime(15 * 60);
    }
    onToggleClick();
  };

  const onToggleClick = () => {
    inProgress ? pauseTimer() : startTimer();
    setInProgress((prev) => !prev);
  };

  return (
    <div id="timer">
      <ProjectSearch />
      <TimerDisplay time={time} />
      <div id="buttons">
        <PrimaryButton onClick={onStartStopClick}>
          {inProgress ? "Stop" : "Start"}
        </PrimaryButton>
        <SecondaryButton onClick={onToggleClick}>
          {inProgress ? "Pause" : "Resume"}
        </SecondaryButton>
      </div>
    </div>
  );
};

export default Timer;
