import React from "react";
import { useMutation } from "react-query";
import { postSession, PostSessionParams } from "../../services/session/session";
import { SnackbarKey, useSnackbar } from "notistack";
import { useHistory } from "react-router-dom";
import { SessionModel } from "../../../shared/types";
import { Method, validateSession } from "../../../shared/validators";
import { History } from "history";
import { Button } from "@material-ui/core";

export const editButton = (
  id: Required<SessionModel>["id"],
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

const useAddSession = () => {
  const [addSession] = useMutation(postSession);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const history = useHistory();
  return async ({ session, project, task }: PostSessionParams) => {
    try {
      const validatedSession = session; //validateSession(session, Method.CREATE);
      //TODO validate session, project and task
      const newSession = await addSession({
        session: validatedSession,
        project,
        task,
      }).then((session) => {
        if (!session) {
          throw new Error("No session was created");
        }
        return session;
      });

      enqueueSnackbar(`New session with id ${newSession.id} was created.`, {
        variant: "success",
        action: editButton(newSession.id, history, closeSnackbar),
      });
    } catch (err) {
      console.log(err);
      enqueueSnackbar(`New session could not be created.`, {
        variant: "error",
      });
    }
  };
};

export default useAddSession;
