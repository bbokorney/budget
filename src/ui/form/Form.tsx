import React, { useEffect } from "react";
import {
  Stack, FormControl, CircularProgress, Typography, Backdrop,
} from "@mui/material";
import { Check } from "@mui/icons-material";
import { useAppSelector, useAppDispatch } from "../../lib/store/hooks";
import {
  selectTransactionForm, clearTransactionFormState, updateTransactionFormState,
} from "../../lib/form/transactionFormSlice";
import { clearFormDialogState } from "../../lib/formDialog/formDialogSlice";
import { useListCategoriesQuery, useUpsertTransactionMutation } from "../../lib/budget/budgetAPI";
import { Transaction } from "../../lib/budget/models";
import FormSelect from "./FormSelect";
import FormTextField from "./FormTextInput";
import CurrencyTextInput from "./CurrencyTextInput";
import FormDatePicker from "./FormDatePicker";

type TransactionFormProps = {
  upsertCacheKey?: string;
  onClose?: () => void;
  // eslint-disable-next-line no-unused-vars
  onTransactionValidChange?: (valid: boolean) => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({
  upsertCacheKey = "",
  onClose = () => {},
  // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
  onTransactionValidChange = (_: boolean) => {},
}) => {
  const dispatch = useAppDispatch();

  const { transaction } = useAppSelector(selectTransactionForm);

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

  const [
    // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
    _,
    { isLoading: isUpserting, isSuccess: isUpsertSuccess, reset },
  ] = useUpsertTransactionMutation({
    fixedCacheKey: upsertCacheKey,
  });

  useEffect(() => {
    if (isUpsertSuccess) {
      setTimeout(() => {
        onClose();
        dispatch(clearFormDialogState());
        dispatch(clearTransactionFormState());
        onTransactionValidChange(false);
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
      onTransactionValidChange(true);
    } else {
      onTransactionValidChange(false);
    }
  };

  const backdropOpen = isCategoriesLoading || isUpserting || isUpsertSuccess;

  const formControlSx = { m: 1, minWidth: 120 };
  return (
    <>
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
    </>
  );
};

export default TransactionForm;
