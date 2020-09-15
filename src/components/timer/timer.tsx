import React, { useCallback, useEffect, useState } from "react";
import { useTimeKeeper } from "../timekeeper/timekeeper";
import {
  ProjectSearch,
  PrimaryButton,
  SecondaryButton,
  TimerDisplay,
  ButtonGroup,
} from "../index";
import useSession from "./useSession";

const Timer = () => {
  const [time, setTime] = useState<number>(15 * 60);
  const [isInProgress, setIsInProgress] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(true);
  const [buttonText, setButtonText] = useState<string>("Start");
  const [clock, startTimer, pauseTimer] = useTimeKeeper();
  const { startSession, endSession } = useSession();
  const [description, setDescription] = useState("");
  const [project, setProject] = useState("");

  // Main clock effect
  useEffect(() => {
    if (isInProgress) {
      setTime((prev) => prev - 1);
    }
  }, [clock, isInProgress]);

  const onStartPauseResumeClick = () => {
    if (!isInProgress) {
      // Start Timer
      setTime(15 * 60);
      startTimer();
      setIsInProgress(true);
      setIsPaused(false);
      setButtonText("Pause");
      startSession(15 * 60, description);
    } else if (!isPaused) {
      // Pause Timer
      pauseTimer();
      setIsPaused(true);
      setButtonText("Resume");
    } else {
      // Resume Timer
      startTimer();
      setIsPaused(false);
      setButtonText("Pause");
    }
  };

  const onStopClick = () => {
    setIsInProgress(false);
    setIsPaused(false);
    setButtonText("Start");
    console.log(endSession(time));
  };

  return (
    <div id="timer">
      <ProjectSearch
        setValue={setProject}
        value={project}
        readOnly={isInProgress}
      />
      <ProjectSearch
        setValue={setDescription}
        value={description}
        readOnly={isInProgress}
        placeholder={"Enter a description"}
      />
      <TimerDisplay time={time} />
      <ButtonGroup>
        <PrimaryButton onClick={onStartPauseResumeClick}>
          {buttonText}
        </PrimaryButton>
        <SecondaryButton disabled={!isInProgress} onClick={onStopClick}>
          Stop
        </SecondaryButton>
      </ButtonGroup>
    </div>
  );
};

export default Timer;
