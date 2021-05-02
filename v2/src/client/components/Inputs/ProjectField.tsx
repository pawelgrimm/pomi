import React, { ChangeEvent } from "react";
import { TextField } from "@material-ui/core";

interface ProjectFieldProps {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

function ProjectField(props: ProjectFieldProps) {
  return (
    <TextField
      id="project"
      name="project"
      label="Project"
      variant="filled"
      fullWidth
      autoComplete="pomi-project"
      value={props.value}
      onChange={props.onChange}
      disabled={props.disabled}
    />
  );
}

export default ProjectField;
