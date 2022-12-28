import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store/store";
import { Transaction } from "../budget/models";

export interface TransactionFormState {
  transaction: Transaction,
}

const initialState: TransactionFormState = {
  transaction: {},
};

export const transactionFormSlice = createSlice({
  name: "transactionForm",
  initialState,
  reducers: {
    updateTransactionFormState: (_, action: PayloadAction<TransactionFormState>) => action.payload,
    clearTransactionFormState: () => initialState,
  },
});

export const { updateTransactionFormState, clearTransactionFormState } = transactionFormSlice.actions;

export const selectTransactionForm = (state: RootState) => state.transactionForm;

export default transactionFormSlice.reducer;
