import React from "react";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import { LoginRoute } from "./LoginRoute";
import { AuthRoute } from "./AuthRoute";
import { LogoutPage } from "../../pages/LoginPage";
import { EditSessionPage, TimerPage } from "../../pages";

export const AppRouter = () => {
  return (
    <Router>
      <Switch>
        <LoginRoute path="/login" />
        <AuthRoute path="/logout">
          <LogoutPage />
        </AuthRoute>
        <AuthRoute path="/edit/:id">
          <EditSessionPage />
        </AuthRoute>
        <AuthRoute path="/">
          <TimerPage />
        </AuthRoute>
      </Switch>
    </Router>
  );
};
