import React, { useCallback, useState } from "react";
import { LoginState } from "../../../../pages/LoginPage";
import { AuthLayout, EmailAndPasswordForm, onSubmitFunction } from "../";
import { useHistory } from "react-router-dom";
import { auth } from "../../../../services/auth";
import { ActionButton, FlexColumnContainer } from "../../../../components";
import { Typography } from "@material-ui/core";
import { SetsLoginState } from "../../types";
import { handleAuthError } from "../../errorHandler";

export const ResetPassword: React.FC<SetsLoginState> = ({ setLoginState }) => {
  const history = useHistory();
  const [isResetSent, setResetSent] = useState(false);

  const onSubmit: onSubmitFunction = useCallback(
    async ({ email }, setFieldError, setFormError) => {
      const actionCodeSettings = {
        url: `${window.location.origin}/login`,
        handleCodeInApp: false,
      };
      auth
        .sendPasswordResetEmail(email, actionCodeSettings)
        .then(() => setResetSent(true))
        .catch((error) => handleAuthError(error, setFieldError, setFormError));
    },
    [setResetSent]
  );

  return (
    <AuthLayout titleText="Reset Password">
      {isResetSent ? (
        <FlexColumnContainer>
          <Typography gutterBottom>
            Password reset instructions have been sent to your email!
          </Typography>
          <ActionButton color="primary" onClick={() => history.push("/")}>
            Continue
          </ActionButton>
        </FlexColumnContainer>
      ) : (
        <EmailAndPasswordForm
          onSubmit={onSubmit}
          setLoginState={setLoginState}
          loginState={LoginState.RESET_PASSWORD}
          omitPasswordField
        />
      )}
    </AuthLayout>
  );
};
