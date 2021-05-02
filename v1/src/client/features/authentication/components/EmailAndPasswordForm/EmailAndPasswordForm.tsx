import React, { useState } from "react";
import { Typography } from "@material-ui/core";
import { Field, Form, Formik } from "formik";
import {
  ActionButton,
  FlexColumnContainer,
  TextField,
} from "../../../../components";
import { LoginState } from "../../../../pages/LoginPage";
import { SetsLoginState } from "../../types";

export type onSubmitFunction = (
  values: any,
  setFieldError: (field: string, message: string) => void,
  setFormError: React.Dispatch<React.SetStateAction<string | undefined>>
) => void;

type Props = SetsLoginState & {
  onSubmit: onSubmitFunction;
  loginState: LoginState;
  omitPasswordField?: boolean;
};

export const EmailAndPasswordForm: React.FC<Props> = ({
  onSubmit,
  setLoginState,
  loginState,
  omitPasswordField,
  children,
}) => {
  const [formError, setFormError] = useState<string | undefined>();

  const submitButtonText =
    loginState === LoginState.LOG_IN
      ? "Log In"
      : loginState === LoginState.RESET_PASSWORD
      ? "Reset Password"
      : "Sign Up";

  const onCancel = () => setLoginState(LoginState.WELCOME);

  return (
    <Formik
      initialValues={{
        email: "",
        password: "",
      }}
      onSubmit={(values, { setFieldError, setSubmitting }) => {
        setFormError(undefined);
        onSubmit(values, setFieldError, setFormError);
        setSubmitting(false);
      }}
    >
      {({ submitForm, isValid }) => (
        <Form>
          <Typography color="error" gutterBottom>
            {formError}
          </Typography>
          <Field
            component={TextField}
            name="email"
            label="Email"
            validate={(value: string) =>
              !value ? "Please enter an email address" : undefined
            }
          />
          {!omitPasswordField && (
            <Field
              component={TextField}
              name="password"
              label="Password"
              type="password"
              validate={(value: string) =>
                !value ? "Please enter a password" : undefined
              }
            />
          )}
          <FlexColumnContainer>
            {React.Children.toArray(children)}
            <ActionButton onClick={submitForm} disabled={!isValid}>
              {submitButtonText}
            </ActionButton>
            <ActionButton onClick={onCancel} variant="outlined">
              Cancel
            </ActionButton>
          </FlexColumnContainer>
        </Form>
      )}
    </Formik>
  );
};
