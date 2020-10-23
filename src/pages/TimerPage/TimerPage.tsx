import React, { useEffect, useState } from "react";
import { Button, ButtonGroup } from "@material-ui/core";
import {
  TimerDisplay,
  DescriptionField,
  ProjectField,
  ActionButton,
} from "../../components";
import { useClock, useSession } from "../../hooks";
import { secondsToFormattedTime } from "../../utils/time";
import { useMutation } from "react-query";
import { SessionParams } from "../../models";
import { SnackbarKey, useSnackbar } from "notistack";
import { postSession } from "../../services/session/session";
import { useHistory } from "react-router-dom";
import { History } from "history";

const useTimer = () => {
  const { start: startClock, stop: stopClock, ticks } = useClock();
  const [isInProgress, setIsInProgress] = useState<boolean>(false);

  const { startSession, endSession } = useSession();

  const addSession = useAddSession();

  const start = (project: string, description: string) => {
    startClock();
    setIsInProgress(true);
    startSession(new Date(), project, description);
  };

  const stop = () => {
    stopClock();
    setIsInProgress(false);
    addSession(endSession(new Date()));
  };

  return { ticks, isInProgress, start, stop };
};

const useAddSession = () => {
  const [addSession] = useMutation(postSession);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const history = useHistory();
  return (session: SessionParams) => {
    addSession(session).then((id) => {
      if (id) {
        enqueueSnackbar(`New session with id ${id} was created.`, {
          variant: "success",
          action: editButton(id, history, closeSnackbar),
        });
      } else {
        enqueueSnackbar(`New session could not be created.`, {
          variant: "error",
        });
      }
    });
  };
};

export const editButton = (
  id: number,
  history: History,
  closeSnackbar: (key?: SnackbarKey) => void
) => {
  return (key: SnackbarKey) => {
    const onClick = () => {
      closeSnackbar(key);
      history.push(`/edit/${id}`);
    };

    return (
      <>
        <Button onClick={onClick}>Edit</Button>
      </>
    );
  };
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
        <ActionButton onClick={onStartStopClick}>
          {isInProgress ? "Stop" : "Start"}
        </ActionButton>
      </ButtonGroup>
    </form>
  );
};

export default TimerPage;
