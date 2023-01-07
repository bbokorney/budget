import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store/store";
import { Transaction } from "../budget/models";

type TransactionToImport = {
  sourceFile: string;
  transaction: Transaction;
}

export interface ImportTransactionsState {
  state: "selectFiles" |
    "parsingFiles" |
    "loadingTransactions" |
    "importingTransactions" |
    "endOfTransactions";
  transactionsIndex: number;
  transactionsToImport: TransactionToImport[],
}

const initialState: ImportTransactionsState = {
  state: "selectFiles",
  transactionsIndex: 0,
  transactionsToImport: [],
};

export const importTransactionsSlice = createSlice({
  name: "importTransactions",
  initialState,
  reducers: {
    updateImportTransactionsState: (_, action: PayloadAction<ImportTransactionsState>) => action.payload,
    clearImportTransactionsState: () => initialState,
  },
});

export const {
  updateImportTransactionsState, clearImportTransactionsState,
} = importTransactionsSlice.actions;

export const selectImportTransactions = (state: RootState) => state.importTransactions;

export default importTransactionsSlice.reducer;
