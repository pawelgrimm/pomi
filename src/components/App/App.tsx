import React from "react";
import { createMuiTheme, CssBaseline, ThemeProvider } from "@material-ui/core";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { EditSession, Header } from "../index";
import Timer from "../Timer/timer";
import styles from "./App.module.scss";

const theme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      main: "#ffd803",
      contrastText: "#272343",
    },
    secondary: {
      main: "#f25f4c",
      contrastText: "#272343",
    },
  },
  typography: {
    fontFamily: "Work Sans, Roboto, Helvetica, Arial, sans-serif",
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
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
                <Timer />
              </Route>
            </Switch>
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;
