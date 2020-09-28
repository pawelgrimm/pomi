import React from "react";
import { createMuiTheme, CssBaseline, ThemeProvider } from "@material-ui/core";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { EditSession, Header, Timer } from "../../components";
import styles from "./App.module.scss";
import theme from "../../styles/theme";

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
