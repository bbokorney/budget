import {
  Link as RouterLink,
  useLocation,
} from "react-router-dom";
import { useMediaQuery, useTheme } from "@mui/material";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import HomeIcon from "@mui/icons-material/Home";
import ViewListIcon from "@mui/icons-material/ViewList";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import Paper from "@mui/material/Paper";

const BottomNavBar = () => {
  const location = useLocation();
  const theme = useTheme();
  const largeScreen = useMediaQuery(theme.breakpoints.up("lg"));
  return (
    <Paper
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        paddingBottom: 2,
      }}
      elevation={3}
    >
      <BottomNavigation
        showLabels
        value={location.pathname}
      >
        <BottomNavigationAction
          label="Home"
          value="/"
          icon={<HomeIcon />}
          component={RouterLink}
          to="/"
        />
        <BottomNavigationAction
          label="Transactions"
          value="/transactions/list"
          icon={<ViewListIcon />}
          component={RouterLink}
          to="/transactions/list"
        />
        {largeScreen
        && (
        <BottomNavigationAction
          label="Import"
          value="/transactions/import"
          icon={<UploadFileIcon />}
          component={RouterLink}
          to="/transactions/import"
        />
        )}
      </BottomNavigation>
    </Paper>
  );
};

export default BottomNavBar;
