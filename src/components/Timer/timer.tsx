import React, { useEffect, useState } from "react";
import {
  Input,
  PrimaryButton,
  TimerDisplay,
  ButtonGroup,
  TextArea,
} from "../index";
import useSession from "./useSession";
import { formatSeconds, getUnixTime } from "../../utils";
import useClock from "../../hooks/useClock/useClock";
import { format } from "date-fns";

const timeNow = () => {
  return format(Date.now(), "s.SSS");
};

const Timer = () => {
  const [time, setTime] = useState<number>(15 * 60);
  const [isInProgress, setIsInProgress] = useState<boolean>(false);
  const [buttonText, setButtonText] = useState<string>("Start");
  const { start, stop, ticks } = useClock();
  const { startSession, endSession } = useSession();
  const [description, setDescription] = useState("");
  const [project, setProject] = useState("");

  // Main clock effect
  useEffect(() => {
    if (isInProgress) {
      setTime((prev) => prev - 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticks]);

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
      start();
      setIsInProgress(true);
      setButtonText("Stop");
      startSession(Date.now(), project, description);
    } else {
      setIsInProgress(false);
      setButtonText("Start");
      stop();
      setTime(60 * 15);
      // TODO: This needs to get refactored and go elsewhere
      const endTime = Date.now();
      const newSession = endSession(endTime);
      const newId = getUnixTime(newSession.date, newSession.startTime);
      const savedSessions = JSON.parse(
        window.localStorage.getItem("sessions") || "{}"
      );
      savedSessions[newId] = newSession;
      window.localStorage.setItem("sessions", JSON.stringify(savedSessions));
      alert(JSON.stringify({ [newId]: newSession }, null, 5));
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
