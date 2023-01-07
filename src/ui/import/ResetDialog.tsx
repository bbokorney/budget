import { useState } from "react";
import {
  Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
} from "@mui/material";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { useAppDispatch } from "../../lib/store/hooks";
import { clearImportTransactionsState } from "../../lib/import/importSlice";

const ResetDialog = () => {
  const dispatch = useAppDispatch();
  const [showDialog, setShowDialog] = useState(false);
  const handleDialogClose = () => {
    setShowDialog(false);
  };
  const onClickReset = () => {
    setShowDialog(false);
    dispatch(clearImportTransactionsState());
  };
  return (
    <>
      <Button
        variant="contained"
        onClick={() => setShowDialog(true)}
        endIcon={<RestartAltIcon />}
      >
        Start over
      </Button>
      <Dialog
        open={showDialog}
        onClose={handleDialogClose}
      >
        <DialogTitle>
          Reset import
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to reset the import?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button variant="contained" onClick={onClickReset} autoFocus>
            Start over
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ResetDialog;
