import React from "react";
import styles from "./TimerDisplay.module.scss";
import { Card } from "../index";

interface Props {
  time: number;
}

/**
 * Convert a time duration (in seconds) to minutes and seconds parts. For example, 65 seconds becomes 1 minute, 05 seconds.
 * @param time duration in seconds
 * @returns [minutes, seconds] with the seconds part padded with 0s to 2 digits
 */
const timeToParts = (time: number): [string, string] => {
  const seconds = Math.abs(time % 60).toString();
  const minutes = Math.floor(time / 60).toString();
  return [minutes, seconds.padStart(2, "0")];
};

const TimerDisplay: React.FC<Props> = ({ time }) => {
  const [minutes, seconds] = timeToParts(time);

  return (
    <Card flex="column">
      <div className={styles.timer}>{`${minutes}:${seconds}`}</div>
    </Card>
  );
};

export default TimerDisplay;
