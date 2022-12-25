import React from "react";
import { useAppSelector, useAppDispatch } from "../../lib/store/hooks";
import { clearFormDialogState, selectFormDialog } from "../../lib/formDialog/formDialogSlice";
import FullScreenDialog from "../../ui/dialog/FullScreen";

type TransactionFormProps = {
  onClose?: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({
  onClose = () => {},
}) => {
  const dispatch = useAppDispatch();
  const { open, actionType } = useAppSelector(selectFormDialog);
  const saveButtonDisabled = true;

  const onDialogClose = () => {
    dispatch(clearFormDialogState());
    onClose();
  };

  const onClickSave = async () => {
    console.log("Save transaction");
  };

  return (
    <FullScreenDialog
      open={open}
      title={`${actionType} transaction`}
      onClose={onDialogClose}
      onSave={onClickSave}
      saveButtonDisabled={saveButtonDisabled}
    >
      <div>Transaction form</div>
    </FullScreenDialog>
  );
};

export default TransactionForm;
