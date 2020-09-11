import React, { useEffect, useState } from "react";
import ProjectSearch from "../project-search/project-search";
import Button from "../button/button";
import { useTimeKeeper } from "../timekeeper/timekeeper";

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
      <div id="timer">{`${Math.floor(time / 60)}:${Math.abs(time % 60)}`}</div>
      <div id="buttons">
        <Button onClick={onStartStopClick}>
          {inProgress ? "Stop" : "Start"}
        </Button>
        <Button onClick={onToggleClick}>
          {inProgress ? "Pause" : "Resume"}
        </Button>
      </div>
    </div>
  );
};

export default Timer;
