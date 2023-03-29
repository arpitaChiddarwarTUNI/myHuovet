import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    background: {
      default: "#65A7DD",
      paper: "#65A7DD",
    },
    primary: {
      main: "#65A7DD",
    },
    secondary: {
      main: "#4775B7",
    },
    third: {
      main: "#5E5BFF",
      contrastText: "#fff",
    },
  },
  typography: {
    fontFamily: ["Bree Serif", "serif"].join(","),
  },
});
