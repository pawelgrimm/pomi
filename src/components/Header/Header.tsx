import React from "react";
import styles from "./Header.module.scss";
import { Brand } from "../index";

interface Props {
  children?: React.ReactNode;
}

const Header: React.FC<Props> = ({ children }) => {
  return (
    <header className={styles.header}>
      <Brand />
      {children}
    </header>
  );
};

export default Header;
