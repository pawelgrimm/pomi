import React from "react";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
  },
}));

export const FlexColumnContainer: React.FC = ({ children }) => {
  const classes = useStyles();
  return <div className={classes.root}>{React.Children.toArray(children)}</div>;
};
