import React from "react";
import { QueryCache, ReactQueryCacheProvider } from "react-query";
import { CssBaseline, ThemeProvider } from "@material-ui/core";
import theme from "../styles/theme";
import { SnackbarProvider } from "notistack";
import { Header } from "../components";
import { AppRouter } from "../features";
import { makeStyles } from "@material-ui/core/styles";

const queryCache = new QueryCache();

const useStyles = makeStyles((theme) => ({
  root: {
    background: "#16161a",
    display: "flex",
    minHeight: "100vh",
    flexDirection: "column",
    margin: "0 auto",
    padding: "0",
    maxWidth: "360px",
  },

  mainContent: {
    flex: 1,
    padding: theme.spacing(2, 3),
  },
}));

const App: React.FC = () => {
  const classes = useStyles();
  return (
    <ReactQueryCacheProvider queryCache={queryCache}>
      <ThemeProvider theme={theme}>
        <SnackbarProvider>
          <CssBaseline />
          <div className={classes.root}>
            <Header />
            <div className={classes.mainContent}>
              <AppRouter />
            </div>
          </div>
        </SnackbarProvider>
      </ThemeProvider>
    </ReactQueryCacheProvider>
  );
};

export default App;
