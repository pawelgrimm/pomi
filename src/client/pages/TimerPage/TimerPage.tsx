import React, { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { History } from "history";
import { SnackbarKey, useSnackbar } from "notistack";
import { useMutation } from "react-query";
import { secondsToFormattedTime } from "../../../shared/utils";
import { useClock, useSession } from "../../hooks";
import { postSession } from "../../services/session/session";
import { Button, ButtonGroup } from "@material-ui/core";
import {
  TimerDisplay,
  DescriptionField,
  ProjectField,
  ActionButton,
} from "../../components";
import useNotification from "use-notification-hook";
import { ClientSessionModel } from "../../../shared/models";
import { validateClientSession } from "../../../shared/validators";

const useTimer = () => {
  const { start: startClock, stop: stopClock, ticks } = useClock();
  const [isInProgress, setIsInProgress] = useState<boolean>(false);

  const { startSession, endSession } = useSession();

  const addSession = useAddSession();

  const start = useCallback(
    (project: string, description: string) => {
      startClock();
      setIsInProgress(true);
      startSession(new Date(), project, description);
    },
    [startClock, startSession]
  );

  const stop = useCallback(() => {
    stopClock();
    setIsInProgress(false);
    addSession(endSession(new Date()));
  }, [addSession, endSession, stopClock]);

  return { ticks, isInProgress, start, stop };
};

const useAddSession = () => {
  const [addSession] = useMutation(postSession);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const history = useHistory();
  return (session: Partial<ClientSessionModel>) => {
    addSession(validateClientSession(session)).then((id) => {
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

interface TimerState {
  time: number;
  description: string;
  project: string;
  notificationSent: boolean;
}

const useTimerState = (initialState: Partial<TimerState>) => {
  const [time, setTime] = useState<number>(initialState.time || 25 * 60);
  const [description, setDescription] = useState(
    initialState.description || ""
  );
  const [project, setProject] = useState(initialState.project || "");

  const [notificationSent, setNotificationSent] = useState(
    initialState.notificationSent || false
  );

  return {
    state: { time, description, project, notificationSent },
    setTime,
    setDescription,
    setProject,
    setNotificationSent,
  };
};

const TimerPage = ({ defaultTime = 25 * 60 }) => {
  const { ticks, isInProgress, start, stop } = useTimer();

  const {
    state,
    setTime,
    setDescription,
    setProject,
    setNotificationSent,
  } = useTimerState({
    time: defaultTime,
  });

  const { notify } = useNotification("Timer complete", {
    tag: "timer-complete",
  });

  // Keep track of elapsed time
  useEffect(() => {
    if (isInProgress) {
      setTime((prev) => prev - 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticks]);

  // Send notification
  useEffect(() => {
    if (isInProgress && state.time <= 0 && !state.notificationSent) {
      notify();
      setNotificationSent(true);
    }
  }, [
    isInProgress,
    notify,
    setNotificationSent,
    state.notificationSent,
    state.time,
    ticks,
  ]);

  // Update document title as needed
  useEffect(() => {
    document.title = isInProgress
      ? secondsToFormattedTime(state.time, { trimmed: true })
      : "Pomi";
  }, [isInProgress, state.time]);

  const onStartStopClick = () => {
    if (!isInProgress) {
      // Start Timer
      start(state.project, state.description);
    } else {
      // Stop Timer
      stop();
      setTime(defaultTime);
      setNotificationSent(false);
    }
  };

  return (
    <form>
      <ProjectField
        value={state.project}
        onChange={(e) => setProject(e.target.value)}
        disabled={isInProgress}
      />
      <DescriptionField
        value={state.description}
        onChange={(e) => setDescription(e.target.value)}
        disabled={isInProgress}
      />
      <TimerDisplay
        time={state.time}
        setTime={setTime}
        isInProgress={isInProgress}
      />
      <ButtonGroup fullWidth orientation="vertical">
        <ActionButton onClick={onStartStopClick}>
          {isInProgress ? "Stop" : "Start"}
        </ActionButton>
      </ButtonGroup>
    </form>
  );
};

export default TimerPage;