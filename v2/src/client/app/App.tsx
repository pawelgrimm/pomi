import React from "react";
import { CssBaseline, ThemeProvider } from "@material-ui/core";
import { AppRouter } from "./router";
import theme from "./theme";
import { SnackbarProvider } from "notistack";
import { persistor, store } from "@infra/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

function App() {
  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ThemeProvider theme={theme}>
            <SnackbarProvider>
              <CssBaseline />
              <AppRouter />
            </SnackbarProvider>
          </ThemeProvider>
        </PersistGate>
      </Provider>
    </>
  );
}

export default App;
