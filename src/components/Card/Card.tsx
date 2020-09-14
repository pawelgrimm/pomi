import React from "react";
import styles from "./Card.module.scss";

interface Props {
  children?: React.ReactNode;
}

const Card: React.FC<Props> = ({ children }) => {
  return <div className={styles.root}>{children}</div>;
};

export default Card;
