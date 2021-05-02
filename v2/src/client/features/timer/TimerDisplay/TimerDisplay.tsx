/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import TimeField from "react-simple-timefield";
import useClock from "./useClock";
import {
  formattedTimeToSeconds,
  secondsToFormattedTime,
} from "@utils/time/time";
import TimeInput from "./TimeInput";

export interface TimerDisplayProps {
  timerStartValue: number;
  isInProgress: boolean;
}

function TimerDisplay({
  isInProgress = false,
  timerStartValue,
}: TimerDisplayProps) {
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
}

export default TimerDisplay;
