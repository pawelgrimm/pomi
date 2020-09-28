import { TextField } from "@material-ui/core";
import React, { ChangeEvent } from "react";

const ProjectField = (props: {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
}) => {
  return (
    <TextField
      id="project"
      label="Project"
      variant="filled"
      fullWidth
      autoComplete="pomi-project"
      value={props.value}
      onChange={props.onChange}
      disabled={props.disabled}
    />
  );
};

export default ProjectField;
