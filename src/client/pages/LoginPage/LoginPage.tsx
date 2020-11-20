import React from "react";
import { Field, Form, Formik } from "formik";
import { ActionButton, TextField } from "../../components";
import { ButtonGroup } from "@material-ui/core";

export const LoginPage: React.FC = () => {
  return (
    <Formik
      initialValues={{
        email: "",
        password: "",
      }}
      onSubmit={(values) => {
        console.log(values);
      }}
    >
      {({ submitForm }) => (
        <Form>
          <Field component={TextField} name="email" label="Email" />
          <Field
            component={TextField}
            name="password"
            label="Password"
            type="password"
          />
          <ButtonGroup fullWidth orientation="vertical">
            <ActionButton onClick={submitForm}>Login</ActionButton>
          </ButtonGroup>
        </Form>
      )}
    </Formik>
  );
};
