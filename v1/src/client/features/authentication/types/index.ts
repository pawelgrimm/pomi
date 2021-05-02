import React from "react";
import { LoginState } from "../../../pages/LoginPage";

export type onSubmitFunction = (
  values: any,
  setFieldError: (field: string, message: string) => void,
  setFormError: React.Dispatch<React.SetStateAction<string | undefined>>
) => void;

export type setFieldError = (field: string, message: string) => void;

export type setFormError = React.Dispatch<
  React.SetStateAction<string | undefined>
>;

export type SetsLoginState = {
  setLoginState: React.Dispatch<React.SetStateAction<LoginState>>;
};
