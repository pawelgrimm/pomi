import React, { useCallback } from "react";
import { LoginState, SetsLoginState } from "../../../../pages/LoginPage";
import { useHistory } from "react-router-dom";
import { AuthLayout } from "../AuthLayout";
import { auth } from "../../../../services/auth";
import {
  EmailAndPasswordForm,
  onSubmitFunction,
} from "../EmailAndPasswordForm";

export const EmailSignup: React.FC<SetsLoginState> = ({ setLoginState }) => {
  const history = useHistory();

  const onSubmit: onSubmitFunction = useCallback(
    async ({ email, password }) => {
      auth
        .createUserWithEmailAndPassword(email, password)
        .then(() => history.push("/"));
    },
    [history]
  );

  return (
    <AuthLayout titleText="Sign Up">
      <EmailAndPasswordForm
        onSubmit={onSubmit}
        setLoginState={setLoginState}
        loginState={LoginState.SIGN_UP}
      />
    </AuthLayout>
  );
};
