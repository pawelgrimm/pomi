import React from "react";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    "&>*": {
      marginBottom: theme.spacing(2),
    },
    "&:last-child": {
      marginBottom: 0,
    },
  },
}));

export const SpacedContainer: React.FC = ({ children }) => {
  const classes = useStyles();
  return <div className={classes.root}>{React.Children.toArray(children)}</div>;
};
