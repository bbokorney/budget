import React, { useState } from "react";
import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../lib/store/hooks";
import {
  importCurrentTransaction,
} from "../../lib/import/importSlice";
import {
  selectTransactionForm, clearTransactionFormState,
} from "../../lib/form/transactionFormSlice";
import TransactionForm from "../form/Form";

type SaveDialogProps = {
  open: boolean;
  onClose: () => void;
  onTransactionSaved: () => void;
}

const SaveDialog: React.FC<SaveDialogProps> = ({ open, onClose, onTransactionSaved }) => {
  const mutationFixedCacheKey = "import-transaction-form";

  const dispatch = useAppDispatch();
  const { transaction: formTransaction } = useAppSelector(selectTransactionForm);

  const [saveButtonEnabled, setSaveButtonEnabled] = useState(false);

  const handleDialogClose = () => {
    dispatch(clearTransactionFormState());
    onClose();
  };

  const onClickSave = () => {
    dispatch(importCurrentTransaction({ transaction: formTransaction, mutationFixedCacheKey }));
  };

  return (
    <Dialog
      open={open}
      onClose={handleDialogClose}
      fullWidth
    >
      <DialogTitle>
        Save transaction
      </DialogTitle>
      <DialogContent>
        <TransactionForm
          upsertCacheKey={mutationFixedCacheKey}
          onClose={handleDialogClose}
          onTransactionSaved={onTransactionSaved}
          onTransactionValidChange={(valid) => setSaveButtonEnabled(valid)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDialogClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={onClickSave}
          autoFocus
          disabled={!saveButtonEnabled}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SaveDialog;
