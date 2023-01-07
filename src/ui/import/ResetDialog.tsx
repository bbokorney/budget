import { useState } from "react";
import {
  Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
} from "@mui/material";
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
    dispatch(clearImportTransactionsState);
  };
  return (
    <>
      <Button variant="contained" onClick={() => setShowDialog(true)}>Start over</Button>
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
          <Button color="secondary" variant="contained" onClick={onClickReset} autoFocus>
            Reset
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ResetDialog;
