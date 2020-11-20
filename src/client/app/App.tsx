import React from "react";
import { CssBaseline, ThemeProvider } from "@material-ui/core";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { TimerPage, EditSessionPage } from "../pages";
import { Header } from "../components";
import styles from "./App.module.scss";
import theme from "../styles/theme";
import { QueryCache, ReactQueryCacheProvider } from "react-query";
import { SnackbarProvider } from "notistack";
import { LoginPage } from "../pages/LoginPage";

const queryCache = new QueryCache();

const App: React.FC = () => {
  return (
    <ReactQueryCacheProvider queryCache={queryCache}>
      <ThemeProvider theme={theme}>
        <SnackbarProvider>
          <CssBaseline />
          <div className={styles.app}>
            <Header />
            <div className={styles.mainContent}>
              <LoginPage />
              {/*<Router>*/}
              {/*  <Switch>*/}
              {/*    <Route path="/edit/:id">*/}
              {/*      <EditSessionPage />*/}
              {/*    </Route>*/}
              {/*    <Route path="/">*/}
              {/*      <TimerPage />*/}
              {/*    </Route>*/}
              {/*  </Switch>*/}
              {/*</Router>*/}
            </div>
          </div>
        </SnackbarProvider>
      </ThemeProvider>
    </ReactQueryCacheProvider>
  );
};

export default App;
