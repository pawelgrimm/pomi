import React from "react";
import { useMutation } from "react-query";
import { postSession } from "../../services/session/session";
import { SnackbarKey, useSnackbar } from "notistack";
import { useHistory } from "react-router-dom";
import { ClientSessionModel } from "../../../shared/models";
import { validateClientSession } from "../../../shared/validators";
import { History } from "history";
import { Button } from "@material-ui/core";

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

export default useAddSession;
