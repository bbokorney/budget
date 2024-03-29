import React, { useEffect } from "react";
import {
  Stack, FormControl, CircularProgress, Typography, Backdrop,
} from "@mui/material";
import { Check } from "@mui/icons-material";
import { useAppSelector, useAppDispatch } from "../../lib/store/hooks";
import {
  selectTransactionForm, updateTransactionFormState,
} from "../../lib/form/transactionFormSlice";
import {
  useListCategoriesQuery, useUpsertTransactionMutation, useListTagsQuery,
} from "../../lib/budget/budgetAPI";
import { Transaction } from "../../lib/budget/models";
import FormSelect from "./FormSelect";
import FormTextField from "./FormTextInput";
import CurrencyTextInput from "./CurrencyTextInput";
import FormDatePicker from "./FormDatePicker";
import {
  selectOptionsFromCategories, optionFromCategoryName, optionsFromTagNames, selectOptionsFromTags,
} from "./selectUtils";

type TransactionFormProps = {
  upsertCacheKey?: string;
  onClose?: () => void;
  onTransactionSaved?: () => void;
  // eslint-disable-next-line no-unused-vars
  onTransactionValidChange?: (valid: boolean) => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({
  upsertCacheKey = "",
  onClose = () => {},
  onTransactionSaved = () => {},
  // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
  onTransactionValidChange = (_: boolean) => {},
}) => {
  const dispatch = useAppDispatch();

  const { transaction } = useAppSelector(selectTransactionForm);

  const { data: categories, isLoading: isCategoriesLoading } = useListCategoriesQuery();
  const categoryOptions = selectOptionsFromCategories(categories);

  const { data: tags, isLoading: isTagsLoading } = useListTagsQuery();
  const tagOptions = selectOptionsFromTags(tags);

  const [
    // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
    _,
    {
      isLoading: isUpserting, isSuccess: isUpsertSuccess, isUninitialized, reset,
    },
  ] = useUpsertTransactionMutation({
    fixedCacheKey: upsertCacheKey,
  });

  useEffect(() => {
    if (isUpsertSuccess) {
      setTimeout(() => {
        onClose();
        onTransactionSaved();
        onTransactionValidChange(false);
        reset();
      }, 1000);
    }
  }, [isUpsertSuccess]);

  useEffect(() => {
    updateTransaction(transaction);
  }, [categories]);

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
          {!isUninitialized && <Typography>{isUpsertSuccess ? "Transaction saved" : "Saving..."}</Typography>}
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
        {!isCategoriesLoading
        && (
        <FormControl sx={formControlSx}>
          <FormSelect
            label="Category"
            initialValue={optionFromCategoryName(transaction.category, categoryOptions)}
            options={categoryOptions ?? []}
            onChange={(option) => {
              if (!(option instanceof Array)) {
                updateTransaction({ ...transaction, category: option?.value ?? "" });
              }
            }}
          />
        </FormControl>
        )}
        {!isTagsLoading
        && (
        <FormControl sx={formControlSx}>
          <FormSelect
            label="Tags"
            multiple
            initialValue={optionsFromTagNames(transaction.tags, tagOptions)}
            options={tagOptions ?? []}
            onChange={(options) => {
              if (options instanceof Array) {
                updateTransaction({ ...transaction, tags: options?.map((o) => o.value) ?? [] });
              }
            }}
          />
        </FormControl>
        )}
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
