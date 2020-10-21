import React, { useEffect, useState } from "react";
import { Input, TextArea } from "../../components";
import { Session } from "../../models";
import { getUnixTime } from "../../utils";
import { format } from "date-fns";
import { Button, ButtonGroup } from "@material-ui/core";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { fetchSession, getSession } from "../../services/session/session";
import { add } from "date-fns";
import { getHoursMinutesFromUnixTime } from "../../utils/time";

interface Props {
  children?: React.ReactNode;
}

const EditSessionPage: React.FC<Props> = ({ children }) => {
  const [date, setDate] = useState(format(Date.now(), "M/dd/yy"));
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState(format(Date.now(), "kmm"));
  const [description, setDescription] = useState("");
  const [project, setProject] = useState("");

  const { id } = useParams();
  console.log(`id is ${id}`);

  const { isLoading, isError, data, error } = useQuery(
    ["todo", { id }],
    fetchSession
  );
  // console.log(sessionQuery);
  useEffect(() => {
    if (data) {
      console.log(data);
      const { date, start_time: startTime, description, duration } = data;
      setDate(date);
      setStartTime(startTime.toString());
      const startTimestamp = getUnixTime(date, startTime);
      const endTimestamp = add(new Date(startTimestamp), {
        seconds: duration / 1000.0,
      });
      const endTime = getHoursMinutesFromUnixTime(endTimestamp.valueOf());
      setEndTime(endTime.toString());
      setDescription(description);
    }
  }, [data]);

  const onClick = () => {
    const session = {
      date: date,
      startTime: Number.parseInt(startTime),
      endTime: Number.parseInt(endTime),
      project,
      description,
    };
    const key = getUnixTime(date, session.startTime);
    alert(JSON.stringify({ [key]: session }, null, 2));
  };

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error}</span>;
  }

  return (
    <>
      <Input setValue={setDate} value={date} placeholder="Date" />
      <Input setValue={setStartTime} value={startTime} placeholder="Start" />
      <Input setValue={setEndTime} value={endTime} placeholder="End" />
      <Input setValue={setProject} value={project} placeholder="Project" />
      <TextArea
        setValue={setDescription}
        value={description}
        placeholder="Description"
      />
      <ButtonGroup>
        <Button onClick={onClick}>Add</Button>
      </ButtonGroup>
    </>
  );
};

export default EditSessionPage;
