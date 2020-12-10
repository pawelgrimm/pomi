import React from "react";
import { RouteProps } from "react-router";
import { Route, Redirect } from "react-router-dom";
import { useAuth } from "../../services/auth";

export const AuthRoute: React.FC<RouteProps> = ({
  children,
  ...routeProps
}) => {
  const { jwt } = useAuth();

  return (
    <Route {...routeProps}>
      {jwt ? React.Children.toArray(children) : <Redirect to="/login" />}
    </Route>
  );
};
