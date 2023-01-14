import { useState } from "react";
import { useAppSelector, useAppDispatch } from "../../lib/store/hooks";
import { clearFormDialogState, selectFormDialog } from "../../lib/formDialog/formDialogSlice";
import FullScreenDialog from "../../ui/dialog/FullScreen";
import {
  selectTransactionForm, clearTransactionFormState,
} from "../../lib/form/transactionFormSlice";
import { useUpsertTransactionMutation } from "../../lib/budget/budgetAPI";
import TransactionForm from "../../ui/form/Form";

const FullScreenDialogTransactionForm = () => {
  const dispatch = useAppDispatch();
  const { open, actionType } = useAppSelector(selectFormDialog);
  const { transaction } = useAppSelector(selectTransactionForm);
  const [saveButtonEnabled, setSaveButtonEnabled] = useState(false);

  const onDialogClose = () => {
    dispatch(clearFormDialogState());
    dispatch(clearTransactionFormState());
  };

  const upsertCacheKey = "full-screen-dialog-form";
  const [
    upsertTransaction,
  ] = useUpsertTransactionMutation({
    fixedCacheKey: upsertCacheKey,
  });

  const onClickSave = async () => {
    upsertTransaction(transaction);
  };

  return (
    <FullScreenDialog
      open={open}
      title={`${actionType} transaction`}
      onClose={onDialogClose}
      onSave={onClickSave}
      saveButtonDisabled={!saveButtonEnabled}
      saveButtonText="Save transaction"
    >
      <TransactionForm
        upsertCacheKey={upsertCacheKey}
        onClose={onDialogClose}
        onTransactionValidChange={(valid) => setSaveButtonEnabled(valid)}
      />

    </FullScreenDialog>
  );
};

export default FullScreenDialogTransactionForm;
