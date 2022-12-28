import React, { useState } from "react";
import {
  Stack, FormControl, InputLabel, Select, SelectChangeEvent,
  TextField, MenuItem, CircularProgress,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { useAppSelector, useAppDispatch } from "../../lib/store/hooks";
import { clearFormDialogState, selectFormDialog } from "../../lib/formDialog/formDialogSlice";
import FullScreenDialog from "../../ui/dialog/FullScreen";
import {
  selectTransactionForm, clearTransactionFormState, updateTransactionFormState,
} from "../../lib/form/transactionFormSlice";
import { Transaction } from "../../lib/budget/models";
import { useListCategoriesQuery, useUpsertTransactionMutation } from "../../lib/budget/budgetAPI";

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

  const [date, setDate] = useState<Date | null>(transaction.date
    ? new Date(transaction.date) : new Date());
  const onDateInputChange = (selectedDate: Date | null) => {
    setDate(selectedDate);
    if (selectedDate) {
      updateTransaction({ ...transaction, date: selectedDate.getTime() });
    }
  };

  const validDigitKeys = Array(10).fill(0).map((_, index) => index.toString());
  const [amount, setAmount] = useState(transaction.amount ? transaction.amount.toFixed(2) : "");
  const [amountError, setAmountError] = useState("");
  const onAmountKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    let newAmount = amount;
    if (e.key === "Backspace") {
      newAmount = amount.toString().substring(0, amount.toString().length - 1);
    } else if (e.key === ".") {
      newAmount = `${amount.toString()}.`;
    } else if (validDigitKeys.includes(e.key)) {
      if (!(amount.split(".").length === 2 && amount.split(".")[1].length === 2)) {
        newAmount += e.key;
      }
    }
    const parsed = parseFloat(newAmount);
    if (Number.isNaN(parsed)) {
      setAmountError("Amount must be a positive number");
    } else {
      if (parsed <= 0) {
        setAmountError("Amount must be a positive number");
        return;
      }
      setAmount(parsed.toFixed(2));
      setAmountError("");
      updateTransaction({ ...transaction, amount: parsed });
    }

    setAmount(newAmount);
  };

  const [category, setCategory] = useState(transaction.category ?? "");
  const onCategoryInputChange = (event: SelectChangeEvent) => {
    const field = event.target.value;
    setCategory(field);
    if (field) {
      updateTransaction({ ...transaction, category: field });
    }
  };
  const { data: categories, isLoading: isCategoriesLoading } = useListCategoriesQuery();

  const [vendor, setVendor] = useState(transaction.vendor ?? "");
  const onVendorInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const field = event.target.value;
    setVendor(field);
    if (field) {
      updateTransaction({ ...transaction, vendor: field });
    }
  };

  const [notes, setNotes] = useState(transaction.notes ?? "");
  const onNotesInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const notesField = event.target.value;
    setNotes(notesField);
    if (notesField) {
      updateTransaction({ ...transaction, notes: notesField });
    }
  };

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
      t = { ...t, date: date?.getTime() };
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
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <MobileDatePicker
                  label="Date"
                  inputFormat="MM/dd/yyyy"
                  value={date}
                  onChange={onDateInputChange}
            // eslint-disable-next-line react/jsx-props-no-spreading
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <TextField
                error={amountError !== ""}
                inputProps={{ inputMode: "numeric" }}
                label="Amount"
                variant="outlined"
                value={amount !== "" ? `$ ${amount}` : ""}
                helperText={amountError}
                placeholder="$ 0.00"
                onKeyUp={onAmountKeyUp}
              />
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={category}
                label="Category"
                onChange={onCategoryInputChange}
              >
                {categories && categories.map((c) => <MenuItem key={c.id} value={c.name}>{c.name}</MenuItem>)}
              </Select>
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <TextField
                label="Vendor"
                value={vendor}
                onChange={onVendorInputChange}
              />
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <TextField
                label="Notes"
                multiline
                maxRows={4}
                value={notes}
                onChange={onNotesInputChange}
              />
            </FormControl>
          </Stack>
        )}
    </FullScreenDialog>
  );
};

export default TransactionForm;
