import React from "react";
import { CssBaseline } from "@material-ui/core";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { EditSession, Header } from "../index";
import Timer from "../Timer/timer";
import styles from "./App.module.scss";

const App: React.FC = () => {
  return (
    <Router>
      <CssBaseline />
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
