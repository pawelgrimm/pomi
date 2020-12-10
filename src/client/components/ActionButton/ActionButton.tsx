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
    <Button
      color={color || "primary"}
      variant={variant || "contained"}
      {...rest}
    />
  );
};

export default withStyles(styles, { name: "ActionButton" })(ActionButton);
