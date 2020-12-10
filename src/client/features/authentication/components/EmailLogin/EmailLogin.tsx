import { useHistory } from "react-router-dom";
import { auth } from "../../../../services/auth";
import React, { useCallback } from "react";
import { LoginState } from "../../../../pages/LoginPage";
import { AuthLayout, EmailAndPasswordForm, onSubmitFunction } from "../";
import { handleAuthError, SetsLoginState } from "../../";
import { Button } from "@material-ui/core";

export const EmailLogin: React.FC<SetsLoginState> = ({ setLoginState }) => {
  const history = useHistory();

  const onSubmit: onSubmitFunction = useCallback(
    async ({ email, password }, setFieldError, setFormError) => {
      auth
        .signInWithEmailAndPassword(email, password)
        .then(() => history.push("/"))
        .catch((error) => handleAuthError(error, setFieldError, setFormError));
    },
    [history]
  );
  const onForgotPassword = () => {};

  return (
    <AuthLayout titleText="Log In">
      <EmailAndPasswordForm
        onSubmit={onSubmit}
        setLoginState={setLoginState}
        loginState={LoginState.LOG_IN}
      >
        <Button onClick={onForgotPassword} variant="text" color="secondary">
          Forgot Password?
        </Button>
      </EmailAndPasswordForm>
    </AuthLayout>
  );
};
