import { useState, MouseEvent } from "react";
import {
  Avatar, IconButton,
  Menu, MenuItem, Divider,
  ListItemIcon,
  Typography,
} from "@mui/material";
import {
  useNavigate,
} from "react-router-dom";
import { Settings, Logout } from "@mui/icons-material";
import CachedIcon from "@mui/icons-material/Cached";
import { useAppSelector } from "../../lib/store/hooks";
import { selectAuth } from "../../lib/auth/authSlice";
import { signUserOut } from "../../lib/auth/auth";

const AccountMenu = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector(selectAuth);
  let avatarLetter = "?";
  if (user?.displayName) {
    avatarLetter = user.displayName[0].toUpperCase();
  }

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const onAvatarClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        onClick={onAvatarClick}
      >
        <Avatar
          sx={{
            width: 32, height: 32, bgcolor: "secondary.main",
          }}
        >{avatarLetter}
        </Avatar>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: "\"\"",
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={() => navigate("/account")}>
          <Avatar sx={{ color: "secondary.contrastText", bgcolor: "secondary.main" }} /> My account
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => navigate("/settings")}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          <Typography>Settings</Typography>
        </MenuItem>
        <MenuItem onClick={() => window.location.reload()}>
          <ListItemIcon>
            <CachedIcon />
          </ListItemIcon>
          Reload
        </MenuItem>
        <MenuItem onClick={() => signUserOut()}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};
export default AccountMenu;
