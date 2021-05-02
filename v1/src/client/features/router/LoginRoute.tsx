import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth } from "../../services/auth";
import { RouteProps } from "react-router";
import { LoginPage } from "../../pages/LoginPage";

export const LoginRoute: React.FC<RouteProps> = ({ ...routeProps }) => {
  const { jwt } = useAuth();

  return (
    <Route {...routeProps}>{!jwt ? <LoginPage /> : <Redirect to="/" />}</Route>
  );
};
