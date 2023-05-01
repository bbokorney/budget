import React, { useState } from "react";
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

  return (
    <>
      {savedTransactionId
        ? (
          <EnabledEditButton
            onClick={() => setDialogOpen(true)}
          />
        ) : <span />}
      <SaveDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onTransactionSaved={() => dispatch(nextTransaction())}
      />
    </>
  );
};

export default EditButton;

type EnabledEditButtonProps = {
  onClick: () => void;
}

const EnabledEditButton: React.FC<EnabledEditButtonProps> = ({ onClick }) => {
  const dispatch = useAppDispatch();

  const currentTransaction = useAppSelector(selectCurrentImportTransaction);
  const savedTransactionId = currentTransaction?.savedTransactionId;

  const { data, isLoading } = useGetTransactionQuery(savedTransactionId ?? "");

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

    onClick();
  };

  return (
    <LoadingButton
      sx={{ padding: 0 }}
      color="secondary"
      onClick={() => handleDialogOpen()}
      loading={isLoading}
    >
      Edit
    </LoadingButton>

  );
};
