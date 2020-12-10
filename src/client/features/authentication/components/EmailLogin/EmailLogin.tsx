import { useHistory } from "react-router-dom";
import { auth } from "../../../../services/auth";
import React, { useCallback, useState } from "react";
import { LoginState, SetsLoginState } from "../../../../pages/LoginPage";
import { AuthLayout } from "../AuthLayout";
import {
  EmailAndPasswordForm,
  onSubmitFunction,
} from "../EmailAndPasswordForm";

// Possible errors throw by GCP Auth module
// https://firebase.google.com/docs/reference/js/firebase.auth.Auth#signinwithemailandpassword
enum LoginError {
  INVALID_EMAIL = "auth/invalid-email",
  USER_DISABLED = "auth/user-disabled",
  USER_NOT_FOUND = "auth/user-not-found",
  WRONG_PASSWORD = "auth/wrong-password",
}

export const EmailLogin: React.FC<SetsLoginState> = ({ setLoginState }) => {
  const history = useHistory();
  const [formError, setFormError] = useState<string | undefined>();

  const onSubmit: onSubmitFunction = useCallback(
    async ({ email, password }, { setFieldError }) => {
      setFormError(undefined);
      auth
        .signInWithEmailAndPassword(email, password)
        .then(() => history.push("/"))
        .catch(({ code, message }: { code: LoginError; message: string }) => {
          switch (code) {
            case LoginError.INVALID_EMAIL:
              setFieldError("email", "Please enter a valid email address");
              break;
            case LoginError.USER_NOT_FOUND:
              setFieldError(
                "email",
                "The email you've entered doesn't match any account."
              );
              break;
            case LoginError.WRONG_PASSWORD:
              setFieldError(
                "password",
                "The password you've entered is incorrect."
              );
              break;
            case LoginError.USER_DISABLED:
              setFormError("This account is disabled");
              break;
            default:
              setFormError(message);
              break;
          }
        });
    },
    [history]
  );

  return (
    <AuthLayout titleText="Log In">
      <EmailAndPasswordForm
        onSubmit={onSubmit}
        setLoginState={setLoginState}
        loginState={LoginState.LOG_IN}
        error={formError}
      />
    </AuthLayout>
  );
};
