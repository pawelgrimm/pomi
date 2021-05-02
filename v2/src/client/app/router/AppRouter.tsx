import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import TimerPage from "@pages/timer";

export const AppRouter = () => {
  return (
    <Router>
      <Switch>
        <Route path="/timer">
          <TimerPage />
        </Route>
        <Route path="/">
          <TimerPage />
        </Route>
      </Switch>
    </Router>
  );
};
