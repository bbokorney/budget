import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      light: "#ffff89",
      main: "#d4e157",
      dark: "#a0af22",
      contrastText: "#fff",
    },
    secondary: {
      light: "#ffd95b",
      main: "#ffa726",
      dark: "#c77800",
      contrastText: "#000",
    },
  },
});

export default theme;
