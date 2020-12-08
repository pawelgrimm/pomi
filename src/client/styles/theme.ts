import { createMuiTheme } from "@material-ui/core";

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
    fontFamily: [
      "Work Sans",
      "Roboto",
      "Helvetica",
      "Arial",
      "sans-serif",
    ].join(","),
  },
  overrides: {
    MuiFormControl: {
      root: {
        marginBottom: "14px",
      },
    },
    MuiInputBase: {
      root: {
        fontSize: "1.1rem",
        color: "#c3c2b9",
      },
    },
    MuiFormLabel: {
      root: {
        fontSize: "1.1rem",
        color: "#797976",
      },
    },
    MuiFilledInput: {
      root: {
        backgroundColor: "#242629",
      },
    },
  },
});

export default theme;
