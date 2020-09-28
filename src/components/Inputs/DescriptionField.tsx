import React, { ChangeEvent } from "react";
import { TextField } from "@material-ui/core";

const DescriptionField = (props: {
  value: string;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  disabled: boolean;
}) => {
  return (
    <TextField
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
};

export default DescriptionField;
