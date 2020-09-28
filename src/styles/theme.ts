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
    button: {
      fontWeight: 400,
      fontSize: "1.5rem",
    },
  },
  overrides: {
    MuiButton: {
      root: {
        padding: "2px 4px",
      },
    },
  },
});

export default theme;
