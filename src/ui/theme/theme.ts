import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      light: "#d4e157",
      main: "#a0af22",
      dark: "#6e8000",
      contrastText: "#fff",
    },
    secondary: {
      light: "#ffd95b",
      main: "#ffa726",
      dark: "#c77800",
      contrastText: "#fff",
    },
  },
});

export default theme;
