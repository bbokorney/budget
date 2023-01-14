import { useState } from "react";
import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle,
} from "@mui/material";
import { Save } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../lib/store/hooks";
import {
  importCurrentTransaction, nextTransaction, selectCurrentImportTransaction,
} from "../../lib/import/importSlice";
import {
  selectTransactionForm, updateTransactionFormState, clearTransactionFormState,
} from "../../lib/form/transactionFormSlice";
import TransactionForm from "../form/Form";

const SaveDialog = () => {
  const mutationFixedCacheKey = "import-transaction-form";

  const dispatch = useAppDispatch();
  const currentTransaction = useAppSelector(selectCurrentImportTransaction);
  const { transaction: formTransaction } = useAppSelector(selectTransactionForm);

  const [showDialog, setShowDialog] = useState(false);
  const [saveButtonEnabled, setSaveButtonEnabled] = useState(false);

  const handleDialogOpen = () => {
    const t = currentTransaction?.transaction;
    if (!t) {
      return;
    }
    const { amount } = t;
    if (!amount) {
      return;
    }
    dispatch(updateTransactionFormState(
      {
        transaction: {
          ...t,
          amount: amount * -1,
        },
      },
    ));
    setShowDialog(true);
  };

  const handleDialogClose = () => {
    setShowDialog(false);
    dispatch(clearTransactionFormState());
  };

  const onClickSave = () => {
    dispatch(importCurrentTransaction({ transaction: formTransaction, mutationFixedCacheKey }));
    dispatch(nextTransaction("saved"));
  };

  return (
    <>
      <Button
        variant="contained"
        color="secondary"
        onClick={handleDialogOpen}
        endIcon={<Save />}
      >
        Save
      </Button>

      <Dialog
        open={showDialog}
        onClose={handleDialogClose}
      >
        <DialogTitle>
          Save transaction
        </DialogTitle>
        <DialogContent>
          <TransactionForm
            upsertCacheKey={mutationFixedCacheKey}
            onClose={handleDialogClose}
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
    </>
  );
};

export default SaveDialog;
