import { TextField as MUITextField } from "@material-ui/core";
import React from "react";
import { fieldToTextField, TextFieldProps } from "formik-material-ui";

interface Props {
  multiline?: boolean;
}

const multilineProps = (isMultiline: boolean | undefined) => {
  if (isMultiline) {
    return {
      fullWidth: true,
      rows: 3,
      rowsMax: 3,
    };
  }
  return {};
};

const TextField = (props: Props & TextFieldProps) => {
  const {
    field: { name },
    multiline,
  } = props;

  return (
    <MUITextField
      {...fieldToTextField(props)}
      {...multilineProps(multiline)}
      variant="filled"
      fullWidth
      autoComplete={`pomi-${name}`}
    />
  );
};

export default TextField;
