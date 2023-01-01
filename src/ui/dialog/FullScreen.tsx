import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Fab from "@mui/material/Fab";
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
  const pixelsFromBottom = 80;
  const calcPositionStyles = () => {
    if (window.visualViewport) {
      const topPixels = window.visualViewport.height - pixelsFromBottom;
      return { top: `${topPixels}px`, bottom: 0 };
    }
    return { top: 0, bottom: `${pixelsFromBottom}px` };
  };

  const [saveButtonPositionStyles, setSaveButtonPositionStyles] = useState(calcPositionStyles);

  useEffect(() => {
    const resizeHandler = () => {
      setSaveButtonPositionStyles(calcPositionStyles());
    };
    window.visualViewport?.addEventListener("resize", resizeHandler);
    return () => window.visualViewport?.removeEventListener("resize", resizeHandler);
  }, []);

  return (
    <Box>
      <Dialog
        fullScreen
        open={open}
        onClose={() => onClose()}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => onClose()}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              {title}
            </Typography>
          </Toolbar>
        </AppBar>
        {children}

        <Stack
          direction="row"
          sx={{
            width: "100%",
            position: "fixed",
            transform: "translateZ(0px)",
            flexGrow: 1,
            justifyContent: "space-around",
            ...saveButtonPositionStyles,
          }}
        >
          <Fab
            disabled={saveButtonDisabled}
            variant="extended"
            color="secondary"
            onClick={() => onSave()}
          >
            {saveButtonText}
          </Fab>
        </Stack>
      </Dialog>
    </Box>
  );
};

export default FullScreenDialog;
