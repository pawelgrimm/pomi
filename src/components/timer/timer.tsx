import React, { useCallback, useEffect, useState } from "react";
import { useTimeKeeper } from "../timekeeper/timekeeper";
import {
  Input,
  PrimaryButton,
  TimerDisplay,
  ButtonGroup,
  TextArea,
} from "../index";
import useSession from "./useSession";
import { formatSeconds } from "../../utils";

const Timer = () => {
  const [time, setTime] = useState<number>(15 * 60);
  const [isInProgress, setIsInProgress] = useState<boolean>(false);
  // const [isPaused, setIsPaused] = useState<boolean>(true);
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

  // Document Title updates
  useEffect(() => {
    if (isInProgress) {
      document.title = formatSeconds(time).join(":");
    } else {
      document.title = "Pomi";
    }
  }, [isInProgress, time]);

  const onStartStopClick = () => {
    if (!isInProgress) {
      // Start Timer
      setTime(15 * 60);
      startTimer();
      setIsInProgress(true);
      setButtonText("Stop");
      startSession(Date.now(), project, description);
    } else {
      setIsInProgress(false);
      setButtonText("Start");
      alert(JSON.stringify(endSession(Date.now()), null, 5));
    }
  };

  return (
    <div id="timer">
      <Input setValue={setProject} value={project} disabled={isInProgress} />
      <TextArea
        setValue={setDescription}
        value={description}
        disabled={isInProgress}
        placeholder={"Enter a description"}
      />
      <TimerDisplay time={time} />
      <ButtonGroup>
        <PrimaryButton onClick={onStartStopClick}>{buttonText}</PrimaryButton>
        {/*<SecondaryButton disabled={!isInProgress} onClick={onStopClick}>*/}
        {/*  Stop*/}
        {/*</SecondaryButton>*/}
      </ButtonGroup>
    </div>
  );
};

export default Timer;
