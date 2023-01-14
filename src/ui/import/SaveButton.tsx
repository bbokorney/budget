import { useState } from "react";
import {
  Button,
} from "@mui/material";
import { Save } from "@mui/icons-material";
import SaveDialog from "./SaveDialog";
import { useAppDispatch, useAppSelector } from "../../lib/store/hooks";
import { selectCurrentImportTransaction, nextTransaction } from "../../lib/import/importSlice";
import { updateTransactionFormState } from "../../lib/form/transactionFormSlice";

const SaveButton = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const dispatch = useAppDispatch();
  const currentTransaction = useAppSelector(selectCurrentImportTransaction);

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
    setDialogOpen(true);
  };

  const handleOnClose = () => {
    dispatch(nextTransaction("saved"));
    setDialogOpen(false);
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
      <SaveDialog open={dialogOpen} onClose={handleOnClose} />
    </>
  );
};

export default SaveButton;
