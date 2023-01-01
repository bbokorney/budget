import React, { useState, useEffect } from "react";
import {
  Stack, FormControl, CircularProgress, Typography, Backdrop,
} from "@mui/material";
import { Check } from "@mui/icons-material";
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
  const dispatch = useAppDispatch();
  const { open, actionType } = useAppSelector(selectFormDialog);
  const { transaction } = useAppSelector(selectTransactionForm);
  const [saveButtonEnabled, setSaveButtonEnabled] = useState(false);

  const { data: categories, isLoading: isCategoriesLoading } = useListCategoriesQuery();
  const categoryOptions = categories?.map(
    (c) => ({ id: c.id ?? "", value: c.name ?? "", displayValue: c.name ?? "" }),
  );
  const optionFromCategoryName = (name?: string) => {
    if (!name) {
      return null;
    }
    return categoryOptions?.find((option) => name === option?.value);
  };

  const onDialogClose = () => {
    dispatch(clearFormDialogState());
    dispatch(clearTransactionFormState());
  };

  const [
    upsertTransaction,
    { isLoading: isUpserting, isSuccess: isUpsertSuccess, reset },
  ] = useUpsertTransactionMutation();

  const onClickSave = async () => {
    upsertTransaction(transaction);
  };

  useEffect(() => {
    if (isUpsertSuccess) {
      setTimeout(() => {
        onClose();
        dispatch(clearFormDialogState());
        dispatch(clearTransactionFormState());
        setSaveButtonEnabled(false);
        reset();
      }, 1000);
    }
  }, [isUpsertSuccess]);

  const updateTransaction = (t: Transaction) => {
    if (t.date === undefined || t.date === 0) {
      t = { ...t, date: new Date().getTime() };
    }
    dispatch(updateTransactionFormState({ transaction: t }));
    if (t.amount !== undefined && t.amount > 0
      && t.category !== undefined && t.category !== ""
      && t.vendor !== undefined && t.vendor !== "") {
      setSaveButtonEnabled(true);
    } else {
      setSaveButtonEnabled(false);
    }
  };

  const backdropOpen = isCategoriesLoading || isUpserting || isUpsertSuccess;

  const formControlSx = { m: 1, minWidth: 120 };

  return (
    <FullScreenDialog
      open={open}
      title={`${actionType} transaction`}
      onClose={onDialogClose}
      onSave={onClickSave}
      saveButtonDisabled={!saveButtonEnabled}
      saveButtonText="Save transaction"
    >

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={backdropOpen}
      >
        <Stack spacing={2} alignItems="center">
          {isUpsertSuccess ? <Check color="primary" /> : <CircularProgress /> }
          <Typography>{isUpsertSuccess ? "Transaction saved" : "Saving..."}</Typography>
        </Stack>
      </Backdrop>

      <Stack sx={{ mt: 1 }}>
        <FormControl sx={formControlSx}>
          <FormDatePicker
            label="Date"
            initialValue={transaction.date ? new Date(transaction.date) : new Date()}
            onChange={(date: Date | null) => date && updateTransaction({
              ...transaction,
              date: date.getTime(),
            })}
          />
        </FormControl>
        <FormControl sx={formControlSx}>
          <CurrencyTextInput
            label="Amount"
            initialValue={transaction.amount}
            onChange={(value) => updateTransaction({ ...transaction, amount: value })}
          />
        </FormControl>
        <FormControl sx={formControlSx}>
          <FormSelect
            label="Category"
            initialValue={optionFromCategoryName(transaction.category)}
            options={categoryOptions ?? []}
            onChange={(option) => {
              updateTransaction({ ...transaction, category: option?.value ?? "" });
            }}
          />
        </FormControl>
        <FormControl sx={formControlSx}>
          <FormTextField
            label="Vendor"
            initialValue={transaction.vendor ?? ""}
            onChange={(value) => updateTransaction({ ...transaction, vendor: value })}
          />
        </FormControl>
        <FormControl sx={formControlSx}>
          <FormTextField
            label="Notes"
            initialValue={transaction.notes ?? ""}
            onChange={(value: string) => updateTransaction({ ...transaction, notes: value })}
            multiline
            maxRows={4}
          />
        </FormControl>
      </Stack>
    </FullScreenDialog>
  );
};

export default TransactionForm;
