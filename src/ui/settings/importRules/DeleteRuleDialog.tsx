import React, { useState, useEffect } from "react";
import {
  IconButton, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Delete } from "@mui/icons-material";
import { useDeleteImportAutoActionRuleMutation } from "../../../lib/budget/budgetAPI";

type DeleteRuleDialogProps = {
  id: string;
}

const DeleteRuleDialog: React.FC<DeleteRuleDialogProps> = ({ id }) => {
  const [open, setOpen] = useState(false);

  const [
    deleteRule,
    {
      isLoading: isDeleting, isSuccess: isDeleteSuccess, reset,
    },
  ] = useDeleteImportAutoActionRuleMutation();

  useEffect(() => {
    if (isDeleteSuccess) {
      setTimeout(() => {
        handleClose();
        reset();
      }, 1000);
    }
  }, [isDeleteSuccess]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    deleteRule({ id });
  };

  return (
    <>
      <IconButton edge="end" onClick={() => setOpen(true)}>
        <Delete />
      </IconButton>

      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>
          Delete import rule
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this import rule?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>

          <LoadingButton
            color="secondary"
            onClick={handleDelete}
            disabled={isDeleteSuccess}
            loading={isDeleting}
            variant="contained"
          >
            {isDeleteSuccess ? "Deleted" : "Delete"}
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeleteRuleDialog;
