import { TextField as MuiTextField } from "@material-ui/core";
import React from "react";
import {
  fieldToTextField,
  TextFieldProps as MuiTextFieldProps,
} from "formik-material-ui";

function multilineProps(isMultiline: boolean | undefined) {
  return isMultiline ?? false
    ? {
        fullWidth: true,
        rows: 3,
        rowsMax: 3,
      }
    : {};
}
type TextFieldProps = {
  multiline?: boolean;
} & MuiTextFieldProps;

function TextField(props: TextFieldProps) {
  const {
    field: { name },
    multiline,
  } = props;

  return (
    <MuiTextField
      {...fieldToTextField(props)}
      {...multilineProps(multiline)}
      variant="filled"
      fullWidth
      autoComplete={`pomi-${name}`}
    />
  );
}

export default TextField;
