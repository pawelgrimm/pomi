import React from "react";
import styles from "./ButtonGroup.module.scss";

interface Props {
  children?: React.ReactNode;
}

const ButtonGroup: React.FC<Props> = ({ children }) => {
  return <div className={styles.group}>{children}</div>;
};

export default ButtonGroup;
