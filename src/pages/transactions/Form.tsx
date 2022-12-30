import React, { useState } from "react";
import {
  Stack, FormControl, CircularProgress,
} from "@mui/material";
import { useAppSelector, useAppDispatch } from "../../lib/store/hooks";
import { clearFormDialogState, selectFormDialog } from "../../lib/formDialog/formDialogSlice";
import FullScreenDialog from "../../ui/dialog/FullScreen";
import {
  selectTransactionForm, clearTransactionFormState, updateTransactionFormState,
} from "../../lib/form/transactionFormSlice";
import { Transaction } from "../../lib/budget/models";
import { useListCategoriesQuery, useUpsertTransactionMutation } from "../../lib/budget/budgetAPI";
import FormSelect from "../../ui/form/FormSelect";
import FormTextField from "../../ui/form/FormTextInput";
import CurrencyTextInput from "../../ui/form/CurrencyTextInput";
import FormDatePicker from "../../ui/form/FormDatePicker";

type TransactionFormProps = {
  onClose?: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({
  onClose = () => {},
}) => {
  // TODO
  // show spinner while saving, don't close until saved
  const dispatch = useAppDispatch();
  const { open, actionType } = useAppSelector(selectFormDialog);
  const { transaction } = useAppSelector(selectTransactionForm);
  const [saveButtonEnabled, setSaveButtonEnabled] = useState(false);

  const { data: categories, isLoading: isCategoriesLoading } = useListCategoriesQuery();
  const categoryOptions = categories?.map(
    (c) => ({ id: c.id ?? "", value: c.name ?? "", displayValue: c.name ?? "" }),
  );

  const onDialogClose = () => {
    dispatch(clearFormDialogState());
    dispatch(clearTransactionFormState());
    onClose();
  };

  const [
    upsertTransaction,
    { isLoading: isUpserting },
  ] = useUpsertTransactionMutation();
  const onClickSave = async () => {
    upsertTransaction(transaction);
    dispatch(clearFormDialogState());
    dispatch(clearTransactionFormState());
  };

  const updateTransaction = (t: Transaction) => {
    if (t.date === undefined || t.date === 0) {
      t = { ...t, date: new Date().getTime() };
    }
    dispatch(updateTransactionFormState({ transaction: t }));
    if (t.amount !== undefined && t.amount > 0
      && t.category !== undefined && t.category !== ""
      && t.vendor !== undefined && t.vendor !== "") {
      setSaveButtonEnabled(true);
    }
  };

  return (
    <FullScreenDialog
      open={open}
      title={`${actionType} transaction`}
      onClose={onDialogClose}
      onSave={onClickSave}
      saveButtonDisabled={!saveButtonEnabled}
    >
      {(isCategoriesLoading || isUpserting) ? <CircularProgress color="secondary" />
        : (
          <Stack sx={{ mt: 1 }}>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <FormDatePicker
                label="Date"
                initialValue={transaction.date ? new Date(transaction.date) : new Date()}
                onChange={(date: Date | null) => date && updateTransaction({
                  ...transaction,
                  date: date.getTime(),
                })}
              />
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <CurrencyTextInput
                label="Amount"
                initialValue={transaction.amount}
                onChange={(value) => updateTransaction({ ...transaction, amount: value })}
              />
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <FormSelect
                label="Categories"
                initialValue={transaction.category ?? ""}
                options={categoryOptions}
                onChange={(value) => updateTransaction({ ...transaction, category: value })}
              />
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <FormTextField
                label="Vendor"
                initialValue={transaction.vendor ?? ""}
                onChange={(value) => updateTransaction({ ...transaction, vendor: value })}
              />
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <FormTextField
                label="Notes"
                initialValue={transaction.notes ?? ""}
                onChange={(value: string) => updateTransaction({ ...transaction, notes: value })}
                multiline
                maxRows={4}
              />
            </FormControl>
          </Stack>
        )}
    </FullScreenDialog>
  );
};

export default TransactionForm;
