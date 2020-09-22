import React from "react";
import styles from "./TimerDisplay.module.scss";
import { Card } from "../index";
import { formatSeconds } from "../../utils";

interface Props {
  time: number;
}

const TimerDisplay: React.FC<Props> = ({ time }) => {
  const [minutes, seconds] = formatSeconds(time);

  return (
    <Card flex="column">
      <div className={styles.timer}>{`${minutes}:${seconds}`}</div>
    </Card>
  );
};

export default TimerDisplay;
