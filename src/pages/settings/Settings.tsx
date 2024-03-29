import {
  Typography, List, ListItem, ListItemText, IconButton,
  ListItemButton,
} from "@mui/material";
import { ArrowForward } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate();
  return (
    <>
      <Typography variant="h6">
        Settings
      </Typography>

      <Typography component="div" sx={{ flexGrow: 1 }}>
        App version: {process.env.REACT_APP_VERSION}
      </Typography>

      <List sx={{ width: "100%", maxWidth: 360 }}>
        <ListItem
          key="categories"
          disablePadding
          secondaryAction={(
            <IconButton edge="end">
              <ArrowForward />
            </IconButton>
            )}
        >
          <ListItemButton onClick={() => navigate("/settings/categories")}>
            <ListItemText primary="Categories" />
          </ListItemButton>
        </ListItem>

        <ListItem
          key="tags"
          disablePadding
          secondaryAction={(
            <IconButton edge="end">
              <ArrowForward />
            </IconButton>
            )}
        >
          <ListItemButton onClick={() => navigate("/settings/tags")}>
            <ListItemText primary="Tags" />
          </ListItemButton>
        </ListItem>

        <ListItem
          key="import"
          disablePadding
          secondaryAction={(
            <IconButton edge="end">
              <ArrowForward />
            </IconButton>
            )}
        >
          <ListItemButton onClick={() => navigate("/settings/import")}>
            <ListItemText primary="Import" />
          </ListItemButton>
        </ListItem>
      </List>
    </>
  );
};

export default Settings;
