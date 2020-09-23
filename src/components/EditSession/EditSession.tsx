import React, { useState } from "react";
import { ButtonGroup, Input, PrimaryButton, TextArea } from "../index";
import { Session } from "../../models";
import { getUnixTime } from "../../utils";
import { format } from "date-fns";

interface Props {
  children?: React.ReactNode;
}

const EditSession: React.FC<Props> = ({ children }) => {
  const [date, setDate] = useState(format(Date.now(), "M/dd/yy"));
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState(format(Date.now(), "kmm"));
  const [description, setDescription] = useState("");
  const [project, setProject] = useState("");

  const onClick = () => {
    const session: Session = {
      date: "",
      startTime: Number.parseInt(startTime),
      endTime: Number.parseInt(endTime),
      project,
      description,
    };
    const key = getUnixTime(date, session.startTime);
    alert(JSON.stringify({ [key]: session }, null, 2));
  };

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
        <PrimaryButton onClick={onClick}>Add</PrimaryButton>
      </ButtonGroup>
    </>
  );
};

export default EditSession;
