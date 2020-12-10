import React, { useCallback } from "react";
import { LoginState } from "../../../../pages/LoginPage";
import { useHistory } from "react-router-dom";
import { auth } from "../../../../services/auth";
import { AuthLayout, EmailAndPasswordForm } from "../";
import { handleAuthError, onSubmitFunction, SetsLoginState } from "../../";

export const EmailSignup: React.FC<SetsLoginState> = ({ setLoginState }) => {
  const history = useHistory();

  const onSubmit: onSubmitFunction = useCallback(
    async ({ email, password }, setFieldError, setFormError) => {
      auth
        .createUserWithEmailAndPassword(email, password)
        .then(() => history.push("/"))
        .catch((error) => handleAuthError(error, setFieldError, setFormError));
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
