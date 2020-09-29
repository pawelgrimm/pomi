import React, { useEffect, useState } from "react";
import { Button, ButtonGroup } from "@material-ui/core";
import { TimerDisplay, DescriptionField, ProjectField } from "../../components";
import { useClock, useSession } from "../../hooks";
import { secondsToFormattedTime } from "../../utils/time";

const Timer = ({ defaultTime = 15 * 60 }) => {
  const { startSession, saveSession } = useSession();
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
      ? secondsToFormattedTime(time, { trimmed: true })
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
      saveSession(Date.now());
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
