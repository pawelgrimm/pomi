import React from "react";
import { Button, ButtonProps, Theme, withStyles } from "@material-ui/core";

const styles = (theme: Theme) => ({
  root: {
    padding: theme.spacing(0.25, 0.5),
    fontWeight: 400,
    fontSize: "1.5rem",
  },
});

const ActionButton = (props: ButtonProps) => {
  const { color, variant, ...rest } = props;
  return (
    <div className="MuiFormControl-root">
      <Button
        color={color ?? "primary"}
        variant={variant ?? "contained"}
        {...rest}
      />
    </div>
  );
};

export default withStyles(styles, { name: "ActionButton" })(ActionButton);
