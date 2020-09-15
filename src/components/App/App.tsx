import React from "react";
import styles from "./App.module.scss";
import { Header } from "../index";
import Timer from "../timer/timer";

const App: React.FC = () => {
  return (
    <div className={styles.app}>
      <Header />
      <Timer />
    </div>
  );
};

export default App;
