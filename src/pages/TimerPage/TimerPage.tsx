import React, { useEffect, useState } from "react";
import { Button, ButtonGroup } from "@material-ui/core";
import { TimerDisplay, DescriptionField, ProjectField } from "../../components";
import { useClock, useSession } from "../../hooks";
import { secondsToFormattedTime } from "../../utils/time";
import { useMutation } from "react-query";
import { Session } from "../../models";
import { useSnackbar } from "notistack";

const useTimer = () => {
  const { start: startClock, stop: stopClock, ticks } = useClock();
  const [isInProgress, setIsInProgress] = useState<boolean>(false);

  const { startSession, endSession } = useSession();

  const addSession = useAddSession();

  const start = (project: string, description: string) => {
    startClock();
    setIsInProgress(true);
    startSession(Date.now(), project, description);
  };

  const stop = () => {
    stopClock();
    setIsInProgress(false);
    addSession(endSession(Date.now()));
  };

  return { ticks, isInProgress, start, stop };
};

const useAddSession = () => {
  const [addSession] = useMutation(postSession);
  const { enqueueSnackbar } = useSnackbar();
  return (session: Session) => {
    addSession(session).then((id) =>
      enqueueSnackbar(`New session with id ${id} was created.`, {
        variant: "success",
      })
    );
  };
};

const postSession = (session: Session): Promise<number> => {
  console.log(session);
  return Promise.resolve(12);
};

const TimerPage = ({ defaultTime = 15 * 60 }) => {
  const { ticks, isInProgress, start, stop } = useTimer();

  const [time, setTime] = useState<number>(defaultTime);
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
      start(project, description);
    } else {
      // Stop Timer
      stop();
      setTime(defaultTime);
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

export default TimerPage;
