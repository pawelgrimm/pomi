import React from "react";
import classNames from "classnames";
import styles from "./Card.module.scss";

interface Props {
  children?: React.ReactNode;
  flex?: "column" | "row";
}

const Card: React.FC<Props> = ({ flex, children }) => {
  const cardClass = classNames({
    [styles.card]: true,
    [styles.flexColumn]: flex === "column",
    [styles.flexRow]: flex === "row",
  });

  return <div className={cardClass}>{children}</div>;
};

export default Card;
