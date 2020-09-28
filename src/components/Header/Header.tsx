import React from "react";
import { AppBar, Toolbar, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  headerContent: {
    alignItems: "start",
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    display: "flex",
    justifyContent: "space-between",
    padding: theme.spacing(1),
  },
  brand: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    fontSize: "2.3rem",
    fontWeight: theme.typography.fontWeightMedium,
    padding: 0,
    margin: 0,
  },
}));

const Header: React.FC = () => {
  const classes = useStyles();
  return (
    <AppBar position="static" className={classes.headerContent}>
      <Toolbar>
        <Typography variant="h1" className={classes.brand}>
          Pomi
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
