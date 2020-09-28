import React, { useEffect, useState } from "react";
import { Button, ButtonGroup } from "@material-ui/core";
import { TimerDisplay, DescriptionField, ProjectField } from "../../components";
import { useClock, useSession } from "../../hooks";
import { formatSeconds, getUnixTime } from "../../utils";
import { Session } from "../../models";

function saveSession(getSession: (endTime: number) => Session) {
  const endTime = Date.now();
  const newSession = getSession(endTime);
  const newId = getUnixTime(newSession.date, newSession.startTime);
  const savedSessions = JSON.parse(
    window.localStorage.getItem("sessions") || "{}"
  );
  savedSessions[newId] = newSession;
  window.localStorage.setItem("sessions", JSON.stringify(savedSessions));
  alert(JSON.stringify({ [newId]: newSession }, null, 5));
}

const Timer = ({ defaultTime = 15 * 60 }) => {
  const { startSession, getSession } = useSession();
  const [time, setTime] = useState<number>(defaultTime);
  const [isInProgress, setIsInProgress] = useState<boolean>(false);
  const { start, stop, ticks } = useClock();
  const [description, setDescription] = useState("");
  const [project, setProject] = useState("");

  // Keep track of elapsed time
  useEffect(() => {
    if (isInProgress) {
      setTime((prev) => prev - 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticks]);

  // Update document title as needed
  useEffect(() => {
    document.title = isInProgress
      ? formatSeconds(time)
          .filter((token, i) => i > 0 || token !== "00")
          .join(":")
      : "Pomi";
  }, [isInProgress, time]);

  const onStartStopClick = () => {
    if (!isInProgress) {
      // Start Timer
      start();
      setIsInProgress(true);
      startSession(Date.now(), project, description);
    } else {
      // Stop Timer
      setIsInProgress(false);
      stop();
      setTime(defaultTime);
      saveSession(getSession);
    }
  };

  return (
    <form>
      <ProjectField
        value={project}
        onChange={(e) => setProject(e.target.value)}
        disabled={isInProgress}
      />
      <DescriptionField
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        disabled={isInProgress}
      />
      <TimerDisplay time={time} setTime={setTime} isInProgress={isInProgress} />
      <ButtonGroup fullWidth orientation="vertical">
        <Button variant="contained" color="primary" onClick={onStartStopClick}>
          {isInProgress ? "Stop" : "Start"}
        </Button>
      </ButtonGroup>
    </form>
  );
};

export default Timer;
