import React, { useEffect, useState } from "react";
import {
  DescriptionField,
  ProjectField,
  TextField,
  ActionButton,
} from "../../components";
import { ButtonGroup } from "@material-ui/core";
import { useParams, useHistory } from "react-router-dom";
import { useMutation, useQuery } from "react-query";
import { fetchSession, patchSession } from "../../services/session/session";
import { useSnackbar } from "notistack";
import {
  getDate,
  getDateStringFromDate,
  getTimeFromDate,
} from "../../../shared/utils";
import { Formik, Form, Field } from "formik";
import { editButton } from "../../hooks/useAddSession/useAddSession";
import { ClientSessionModel } from "../../../shared/models";

interface Props {
  children?: React.ReactNode;
}

interface SessionState {
  date: string;
  startTime: string;
  endTime: string;
  project: string;
  task: string;
  notes: string;
}

const initialState: SessionState = {
  date: "",
  startTime: "",
  endTime: "",
  project: "",
  task: "",
  notes: "",
};

const sessionToSessionState = (session: ClientSessionModel): SessionState => {
  const {
    startTimestamp,
    endTimestamp,
    project = "",
    task,
    notes = "",
  } = session;
  const date = getDateStringFromDate(startTimestamp);
  const startTime = getTimeFromDate(startTimestamp).toString();
  const endTime = getTimeFromDate(endTimestamp).toString();
  return {
    date,
    startTime,
    endTime,
    project,
    task,
    notes,
  };
};

const EditSessionPage: React.FC<Props> = () => {
  const [session, setSession] = useState<SessionState>(initialState);

  const history = useHistory();
  const { id } = useParams();

  const { isLoading, isError, data, error } = useQuery<ClientSessionModel>(
    ["todo", { id }],
    fetchSession
  );

  useEffect(() => {
    if (data) {
      setSession(sessionToSessionState(data));
    }
  }, [data]);

  const [updateSession] = useMutation(patchSession);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error}</span>;
  }

  return (
    <Formik
      enableReinitialize={true}
      initialValues={session}
      onSubmit={(values, { setSubmitting }) => {
        const { date, startTime, endTime, ...rest } = values;
        let sessionUpdates: Partial<ClientSessionModel> = {
          startTimestamp: getDate(
            values.date,
            Number.parseInt(values.startTime)
          ),
          endTimestamp: getDate(values.date, Number.parseInt(values.endTime)),
          ...rest,
        };
        updateSession({ id, session: sessionUpdates }).then((success) => {
          if (success) {
            enqueueSnackbar("Session successfully updated!", {
              variant: "success",
              action: editButton(id, history, closeSnackbar),
            });
            history.push("/");
          } else {
            enqueueSnackbar("Session could not be updated.", {
              variant: "error",
            });
          }
        });
      }}
    >
      {({ submitForm, isSubmitting }) => (
        <Form>
          <Field component={TextField} name="date" label="Date" />
          <Field component={TextField} name="startTime" label="Start Time" />
          <Field component={TextField} name="endTime" label="End Time" />
          <Field component={TextField} name="project" label="Project" />
          <Field component={TextField} name="task" label="Task" />
          <Field component={TextField} multiline name="notes" label="Notes" />
          <ButtonGroup fullWidth orientation="vertical">
            <ActionButton onClick={submitForm} disabled={isSubmitting}>
              Save Changes
            </ActionButton>
          </ButtonGroup>
        </Form>
      )}
    </Formik>
  );
};

export { EditSessionPage };