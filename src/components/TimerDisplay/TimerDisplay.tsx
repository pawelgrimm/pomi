import React, { useEffect, useState } from "react";
import { FilledInput } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import TimeField from "react-simple-timefield";
import {
  secondsToFormattedTime,
  formattedTimeToSeconds,
} from "../../utils/time";

interface Props {
  time: number;
  isInProgress: boolean;
  setTime: React.Dispatch<React.SetStateAction<number>>;
}

const useStyles = makeStyles({
  root: {
    padding: "15px 10px",
    marginBottom: "14px",
  },
  input: {
    fontSize: "64px",
    padding: 0,
    textAlign: "center",
  },
});

const TimeInput = ({ ...rest }) => {
  const classes = useStyles();

  return (
    <FilledInput
      classes={{
        root: classes.root,
        input: classes.input,
      }}
      id="time"
      name="time"
      fullWidth
      {...rest}
    />
  );
};

const TimerDisplay: React.FC<Props> = ({
  time,
  setTime,
  isInProgress = false,
}) => {
  const [formattedTime, setFormattedTime] = useState("");

  useEffect(() => {
    setFormattedTime(secondsToFormattedTime(time));
  }, [time]);

  if (isInProgress) {
    return <TimeInput disabled value={formattedTime} />;
  }
  return (
    <TimeField
      value={formattedTime}
      onChange={(e, value) => {
        setTime(formattedTimeToSeconds(value));
      }}
      input={<TimeInput />}
      showSeconds
    />
  );
};

export default TimerDisplay;
