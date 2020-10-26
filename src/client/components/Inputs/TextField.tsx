import { TextField as MUITextField } from "@material-ui/core";
import React, { ChangeEvent } from "react";

const TextField = (props: {
  label: string;
  id?: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}) => {
  return (
    <MUITextField
      id={props.id || props.label.toLowerCase()}
      name={props.id || props.label.toLowerCase()}
      label={props.label}
      variant="filled"
      fullWidth
      autoComplete={`pomi-${props.id || props.label.toLowerCase()}`}
      value={props.value}
      onChange={props.onChange}
      disabled={props.disabled}
    />
  );
};

export default TextField;
