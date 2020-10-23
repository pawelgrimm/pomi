import React, { useEffect, useState } from "react";
import {
  DescriptionField,
  ProjectField,
  TextField,
  ActionButton,
} from "../../components";
import { Session, SessionParams } from "../../models";
import { getEpochTime } from "../../utils";
import { ButtonGroup } from "@material-ui/core";
import { useParams, useHistory } from "react-router-dom";
import { useMutation, useQuery } from "react-query";
import { fetchSession, patchSession } from "../../services/session/session";
import { useSnackbar } from "notistack";
import { getDateStringFromDate, getTimeFromDate } from "../../utils/time";
import { add } from "date-fns";
import { Formik, Form } from "formik";

interface Props {
  children?: React.ReactNode;
}

interface SessionState {
  date: string;
  startTime: string;
  endTime: string;
  description: string;
  project: string;
}

const initialState: SessionState = {
  date: "",
  startTime: "",
  endTime: "",
  description: "",
  project: "",
};

const sessionToSessionState = (session: Session): SessionState => {
  const { start_timestamp, description, duration } = session;
  const startDate = new Date(start_timestamp);
  const date = getDateStringFromDate(startDate);
  const startTime = getTimeFromDate(startDate).toString();
  const endDate = add(startDate, {
    seconds: duration / 1000.0,
  });
  const endTime = getTimeFromDate(endDate).toString();
  return {
    date,
    startTime,
    endTime,
    description,
    project: "",
  };
};

const EditSessionPage: React.FC<Props> = () => {
  const [session, setSession] = useState<SessionState>(initialState);

  const history = useHistory();
  const { id } = useParams();

  const { isLoading, isError, data, error } = useQuery<Session>(
    ["todo", { id }],
    fetchSession
  );

  useEffect(() => {
    if (data) {
      setSession(sessionToSessionState(data));
    }
  }, [data]);

  const [updateSession] = useMutation(patchSession);
  const { enqueueSnackbar } = useSnackbar();

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
        let sessionUpdates: SessionParams = {
          startTimestamp: getEpochTime(
            values.date,
            Number.parseInt(values.startTime)
          ),
          endTimestamp: getEpochTime(
            values.date,
            Number.parseInt(values.endTime)
          ),
          description: values.description,
        };
        updateSession({ id, session: sessionUpdates }).then((success) => {
          if (success) {
            enqueueSnackbar("Session successfully updated!", {
              variant: "success",
            });
            history.push("/");
            setSubmitting(false);
          } else {
            enqueueSnackbar("Session could not be updated.", {
              variant: "error",
            });
          }
        });
      }}
    >
      {({ submitForm, handleChange, values, isSubmitting }) => (
        <Form>
          <TextField label="Date" onChange={handleChange} value={values.date} />
          <TextField
            label="Start Time"
            id="startTime"
            onChange={handleChange}
            value={values.startTime}
          />
          <TextField
            label="End Time"
            id="endTime"
            onChange={handleChange}
            value={values.endTime}
          />
          <ProjectField value={values.project} onChange={handleChange} />
          <DescriptionField
            onChange={handleChange}
            value={values.description}
          />
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

export default EditSessionPage;
