/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  formattedTimeToSeconds,
  secondsToFormattedTime,
} from "@utils/time/time";
import TimeField from "react-simple-timefield";
import { useClock } from "../../hooks";
import { TimeInput } from "../index";

export interface TimerDisplayProps {
  timerStartValue: number;
  isInProgress: boolean;
}

function TimerDisplay({
  isInProgress = false,
  timerStartValue,
}: TimerDisplayProps) {
  const [time, setTime] = useState(timerStartValue + 2);
  const { ticks } = useClock();

  // Reset the timer if it's stopped
  useEffect(() => {
    if (!isInProgress) {
      setTime(timerStartValue);
    }
  }, [isInProgress, timerStartValue]);

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
