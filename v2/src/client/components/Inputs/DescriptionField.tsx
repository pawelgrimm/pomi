import React, { ChangeEvent } from "react";
import { TextField } from "@material-ui/core";

interface DescriptionFieldProps {
  value: string;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  disabled?: boolean;
}

function DescriptionField(props: DescriptionFieldProps) {
  return (
    <TextField
      id="description"
      name="description"
      label="Description"
      variant="filled"
      multiline
      fullWidth
      autoComplete="pomi-description"
      rows={3}
      rowsMax={3}
      value={props.value}
      onChange={props.onChange}
      disabled={props.disabled}
    />
  );
}

export default DescriptionField;
