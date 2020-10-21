import React from "react";
import { CssBaseline, ThemeProvider } from "@material-ui/core";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { TimerPage } from "../pages";
import { EditSession, Header } from "../components";
import styles from "./App.module.scss";
import theme from "../styles/theme";
import { QueryCache, ReactQueryCacheProvider } from "react-query";
import { SnackbarProvider } from "notistack";

const queryCache = new QueryCache();

const App: React.FC = () => {
  return (
    <ReactQueryCacheProvider queryCache={queryCache}>
      <ThemeProvider theme={theme}>
        <SnackbarProvider>
          <Router>
            <CssBaseline />
            <div className={styles.app}>
              <Header />
              <div className={styles.mainContent}>
                <Switch>
                  <Route path="/fudge">
                    <EditSession />
                  </Route>
                  <Route path="/">
                    <TimerPage />
                  </Route>
                </Switch>
              </div>
            </div>
          </Router>
        </SnackbarProvider>
      </ThemeProvider>
    </ReactQueryCacheProvider>
  );
};

export default App;
