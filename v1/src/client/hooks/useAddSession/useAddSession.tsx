import React from "react";
import { useMutation } from "react-query";
import { postSession, PostSessionParams } from "../../services/session/session";
import { SnackbarKey, useSnackbar } from "notistack";
import { useHistory } from "react-router-dom";
import { SessionModel } from "../../../shared/types";
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
      //TODO validate session, project and task
      const result = await addSession({
        session,
        project,
        task,
      }).then((result) => {
        if (!result) {
          throw new Error("No session was created");
        }
        return result;
      });

      enqueueSnackbar(`New session with id ${result.session.id} was created.`, {
        variant: "success",
        action: editButton(result.session.id, history, closeSnackbar),
      });

      return result;
    } catch (err) {
      console.log(err);
      enqueueSnackbar(`New session could not be created.`, {
        variant: "error",
      });
      throw new Error("No session was created");
    }
  };
};

export default useAddSession;
