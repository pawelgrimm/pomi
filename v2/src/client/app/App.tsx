import React from "react";
import { CssBaseline, ThemeProvider } from "@material-ui/core";
import { AppRouter } from "./router";
import theme from "./theme";
import { SnackbarProvider } from "notistack";

function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <SnackbarProvider>
          <CssBaseline />
          <AppRouter />
        </SnackbarProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
