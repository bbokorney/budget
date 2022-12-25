import Typography from "@mui/material/Typography";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import AccountMenu from "../account/AccountMenu";

const TopBar = () => (
  <AppBar position="static">
    <Toolbar>
      <Typography
        variant="h4"
        component="div"
        sx={{
          flexGrow: 1,
          fontWeight: "bold",
          fontStyle: "italic",
          fontSize: "2rem",
        }}
      >
        Budget
      </Typography>
      <AccountMenu />
    </Toolbar>
  </AppBar>
);

export default TopBar;
