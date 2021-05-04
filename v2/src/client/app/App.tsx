import React from "react";
import { CssBaseline, ThemeProvider } from "@material-ui/core";
import { AppRouter } from "./router";
import theme from "./theme";
import { SnackbarProvider } from "notistack";
import { store } from "./store";
import { Provider } from "react-redux";

function App() {
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
