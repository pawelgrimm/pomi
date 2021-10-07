import { FilledInput, FilledInputProps } from "@material-ui/core";
import React from "react";
import { createStyles, withStyles, WithStyles } from "@material-ui/core/styles";

type TimeInputProps = FilledInputProps & WithStyles<typeof styles>;

const TimeInput = ({ classes, ...rest }: TimeInputProps) => {
  return (
    <FilledInput
      classes={{
        root: classes.root,
        input: classes.input,
      }}
      id="time"
      name="time"
      fullWidth
      {...rest}
    />
  );
};

const styles = createStyles({
  root: {
    padding: "15px 10px",
    marginBottom: "14px",
  },
  input: {
    fontSize: "64px",
    padding: 0,
    textAlign: "center",
  },
});

export default withStyles(styles)(TimeInput);
