import { useState } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  selectCurrentImportTransaction,
  nextTransaction,
} from "../../lib/import/importSlice";
import { useAppSelector, useAppDispatch } from "../../lib/store/hooks";
import SaveDialog from "./SaveDialog";
import { useGetTransactionQuery } from "../../lib/budget/budgetAPI";
import { updateTransactionFormState } from "../../lib/form/transactionFormSlice";

const EditButton = () => {
  const dispatch = useAppDispatch();
  const [dialogOpen, setDialogOpen] = useState(false);

  const currentTransaction = useAppSelector(selectCurrentImportTransaction);
  const savedTransactionId = currentTransaction?.savedTransactionId;

  const { data, isLoading } = savedTransactionId
    ? useGetTransactionQuery(savedTransactionId ?? "")
    : { data: { amount: undefined }, isLoading: false };

  const handleDialogOpen = () => {
    const t = data;
    if (!t) {
      return;
    }

    const { amount } = t;
    if (!amount) {
      return;
    }
    dispatch(updateTransactionFormState({ transaction: t }));

    setDialogOpen(true);
  };

  const handleOnClose = () => {
    dispatch(nextTransaction("saved"));
    setDialogOpen(false);
  };

  return (
    <>
      {savedTransactionId
        ? (
          <LoadingButton
            sx={{ padding: 0 }}
            color="secondary"
            onClick={() => handleDialogOpen()}
            loading={isLoading}
          >
            Edit
          </LoadingButton>
        ) : <span />}
      <SaveDialog open={dialogOpen} onClose={handleOnClose} />
    </>
  );
};

export default EditButton;
