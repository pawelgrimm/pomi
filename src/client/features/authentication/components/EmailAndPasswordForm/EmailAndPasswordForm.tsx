import React from "react";
import { Field, Form, Formik } from "formik";
import { TextField } from "../../../../components/Inputs";
import { SpacedContainer } from "../../../../components/SpacedContainer";
import { ActionButton } from "../../../../components";
import { FormikHelpers } from "formik/dist/types";
import { LoginState, SetsLoginState } from "../../../../pages/LoginPage";
import { Button, Typography } from "@material-ui/core";
import { auth } from "../../../../services/auth";

export type onSubmitFunction = (
  values: any,
  formikHelpers: FormikHelpers<any>
) => void | Promise<any>;

type Props = SetsLoginState & {
  onSubmit: onSubmitFunction;
  loginState: LoginState.LOG_IN | LoginState.SIGN_UP;
  error?: String;
};

export const EmailAndPasswordForm: React.FC<Props> = ({
  onSubmit,
  setLoginState,
  loginState,
  error,
}) => {
  const submitButtonText =
    loginState === LoginState.LOG_IN ? "Log In" : "Sign Up";

  const onCancel = () => setLoginState(LoginState.WELCOME);
  const onForgotPassword = (email: string) => {
    const actionCodeSettings = {
      url: "http://localhost:3000/login",
      handleCodeInApp: false,
    };
    auth
      .sendPasswordResetEmail(email, actionCodeSettings)
      .then(() => console.log("reset email sent"));
  };
  return (
    <Formik
      initialValues={{
        email: "",
        password: "",
      }}
      onSubmit={onSubmit}
    >
      {({ submitForm, values, isValid }) => (
        <Form>
          {error && (
            <Typography color="secondary" gutterBottom>
              {error}
            </Typography>
          )}
          <Field
            component={TextField}
            name="email"
            label="Email"
            validate={(value: string) =>
              !value ? "Please enter an email address" : undefined
            }
          />
          <Field
            component={TextField}
            name="password"
            label="Password"
            type="password"
            validate={(value: string) =>
              !value ? "Please enter a password" : undefined
            }
          />
          <SpacedContainer>
            {loginState === LoginState.LOG_IN && (
              <Button
                onClick={() => onForgotPassword(values.email)}
                variant="text"
                color="secondary"
              >
                Forgot Password?
              </Button>
            )}
            <ActionButton onClick={submitForm} disabled={!isValid}>
              {submitButtonText}
            </ActionButton>
            <ActionButton onClick={onCancel} variant="outlined">
              Cancel
            </ActionButton>
          </SpacedContainer>
        </Form>
      )}
    </Formik>
  );
};
