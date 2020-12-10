import React, { useCallback, useState } from "react";
import { LoginState, SetsLoginState } from "../../../../pages/LoginPage";
import { useHistory } from "react-router-dom";
import { AuthLayout } from "../AuthLayout";
import { auth } from "../../../../services/auth";
import {
  EmailAndPasswordForm,
  onSubmitFunction,
} from "../EmailAndPasswordForm";

// Possible errors throw by GCP Auth module
// https://firebase.google.com/docs/reference/js/firebase.auth.Auth#createuserwithemailandpassword
enum LoginError {
  EMAIL_IN_USE = "auth/email-already-in-use",
  INVALID_EMAIL = "auth/invalid-email",
  NOT_ALLOWED = "auth/operation-not-allowed",
  WEAK_PASSWORD = "auth/weak-password",
}

export const EmailSignup: React.FC<SetsLoginState> = ({ setLoginState }) => {
  const history = useHistory();
  const [formError, setFormError] = useState<string | undefined>();

  const onSubmit: onSubmitFunction = useCallback(
    async ({ email, password }, { setFieldError }) => {
      setFormError(undefined);
      auth
        .createUserWithEmailAndPassword(email, password)
        .then(() => history.push("/"))
        .catch(({ code, message }: { code: LoginError; message: string }) => {
          switch (code) {
            case LoginError.EMAIL_IN_USE:
              setFieldError(
                "email",
                "The email you've entered is already in use."
              );
              break;
            case LoginError.INVALID_EMAIL:
              setFieldError("email", "Please enter a valid email address");
              break;
            case LoginError.NOT_ALLOWED:
              setFormError(
                "Account creation is currently disabled. Please try again later."
              );
              break;
            case LoginError.WEAK_PASSWORD:
              setFieldError("password", message);
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
    <AuthLayout titleText="Sign Up">
      <EmailAndPasswordForm
        onSubmit={onSubmit}
        setLoginState={setLoginState}
        loginState={LoginState.SIGN_UP}
        error={formError}
      />
    </AuthLayout>
  );
};
