import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";

const Transition = React.forwardRef((
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
  // eslint-disable-next-line react/jsx-props-no-spreading
) => <Slide direction="up" ref={ref} {...props} />);

type FullScreenDialogProps = {
  children: React.ReactNode;
  open?: boolean;
  title: string;
  saveButtonText?: string;
  saveButtonDisabled?: boolean;
  onSave?: () => void;
  onClose?: () => void;
}

const FullScreenDialog: React.FC<FullScreenDialogProps> = ({
  children, open = false, title,
  saveButtonText = "Save",
  saveButtonDisabled = true,
  onClose = () => {},
  onSave = () => {},
}) => {
  const handleClose = () => {
    onClose();
  };

  const handleSave = () => {
    onSave();
    onClose();
  };

  return (
    <Box>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              {title}
            </Typography>
            <Button disabled={saveButtonDisabled} autoFocus color="inherit" onClick={handleSave}>
              {saveButtonText}
            </Button>
          </Toolbar>
        </AppBar>
        {children}
      </Dialog>
    </Box>
  );
};

export default FullScreenDialog;
