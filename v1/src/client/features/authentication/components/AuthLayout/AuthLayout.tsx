import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  title: {
    padding: theme.spacing(4, 0),
  },
  titleLarge: {
    padding: theme.spacing(12, 0),
  },
}));

type Props = {
  titleText: string;
  largeTitle?: boolean;
};

export const AuthLayout: React.FC<Props> = ({
  children,
  titleText,
  largeTitle,
}) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Typography
        className={largeTitle ? classes.titleLarge : classes.title}
        variant="h2"
        align="center"
      >
        {titleText}
      </Typography>
      {React.Children.toArray(children)}
    </div>
  );
};
