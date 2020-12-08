/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { FilledInput } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import TimeField from "react-simple-timefield";
import {
  secondsToFormattedTime,
  formattedTimeToSeconds,
} from "../../../shared/utils";
import { useClock } from "../../hooks";

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

interface Props {
  timerStartValue: number;
  isInProgress: boolean;
}

const TimerDisplay: React.FC<Props> = ({
  isInProgress = false,
  timerStartValue,
}) => {
  const [time, setTime] = useState(timerStartValue + 2);
  const { start, stop, ticks } = useClock();

  useEffect(() => {
    if (isInProgress) {
      // Timer was started
      start();
    } else {
      // Timer was stopped
      stop();
      setTime(timerStartValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInProgress]);

  useEffect(() => {
    if (!isInProgress) {
      setTime(timerStartValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timerStartValue]);

  useEffect(() => {
    if (isInProgress) {
      setTime((prev) => prev - 1);
    }
  }, [ticks]);

  const formattedTime = secondsToFormattedTime(time);

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
