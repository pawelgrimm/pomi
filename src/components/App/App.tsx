import React from "react";
import styles from "./App.module.scss";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { EditSession, Header } from "../index";
import Timer from "../timer/timer";

const App: React.FC = () => {
  return (
    <Router>
      <div className={styles.app}>
        <Header />
        <div className={styles.mainContent}>
          <Switch>
            <Route path="/fudge">
              <EditSession />
            </Route>
            <Route path="/">
              <Timer />
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
};

export default App;
