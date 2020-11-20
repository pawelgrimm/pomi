import { useHistory } from "react-router-dom";
import { auth } from "../../../../services/auth";
import React, { useCallback } from "react";
import { LoginState, SetsLoginState } from "../../../../pages/LoginPage";
import { AuthLayout } from "../AuthLayout";
import {
  EmailAndPasswordForm,
  onSubmitFunction,
} from "../EmailAndPasswordForm";

export const EmailLogin: React.FC<SetsLoginState> = ({ setLoginState }) => {
  const history = useHistory();

  const onSubmit: onSubmitFunction = useCallback(
    async ({ email, password }) => {
      auth
        .signInWithEmailAndPassword(email, password)
        .then(() => history.push("/"));
    },
    [history]
  );

  return (
    <AuthLayout titleText="Log In">
      <EmailAndPasswordForm
        onSubmit={onSubmit}
        setLoginState={setLoginState}
        loginState={LoginState.LOG_IN}
      />
    </AuthLayout>
  );
};
