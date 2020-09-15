import React from "react";
import styles from "./App.module.scss";
import { Header } from "../index";
import Timer from "../timer/timer";

const App: React.FC = () => {
  return (
    <div className={styles.app}>
      <Header />
      <div className={styles.mainContent}>
        <Timer />
      </div>
    </div>
  );
};

export default App;
