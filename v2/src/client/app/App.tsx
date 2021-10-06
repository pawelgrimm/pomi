import React, { useEffect, useState } from "react";
import { CssBaseline, ThemeProvider } from "@material-ui/core";
import { AppRouter } from "./router";
import theme from "./theme";
import { SnackbarProvider } from "notistack";
import { store } from "@infra/redux/store";
import { Provider } from "react-redux";
import { initializeProjects } from "@infra/redux/projectsSlice";

function App() {
  const [initialized, setInitialized] = useState(false);
  useEffect(() => {
    store.dispatch(initializeProjects()).then(
      () => setInitialized(true),
      () => setInitialized(true)
    );
  }, []);

  if (!initialized) {
    return <h1>Loading...</h1>;
  }
  return (
    <>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <SnackbarProvider>
            <CssBaseline />
            <AppRouter />
          </SnackbarProvider>
        </ThemeProvider>
      </Provider>
    </>
  );
}

export default App;
