import React from "react";
import { Button, ButtonProps, withStyles } from "@material-ui/core";

const styles = () => ({
  root: {
    padding: "2px 4px",
    fontWeight: 400,
    fontSize: "1.5rem",
  },
});

const ActionButton = (props: ButtonProps) => {
  const { color, variant, ...rest } = props;
  return (
    <Button
      color={color === "default" ? "primary" : color}
      variant="contained"
      {...rest}
    />
  );
};

export default withStyles(styles, { name: "ActionButton" })(ActionButton);
