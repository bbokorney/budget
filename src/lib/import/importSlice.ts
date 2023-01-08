import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { subDays, addDays } from "date-fns";
import { RootState } from "../store/store";
import { Transaction } from "../budget/models";
import parseTransactions from "./fileParsing";
import BudgetFirebaseAPI from "../budget/budgetFirebaseAPI";

const api = new BudgetFirebaseAPI();

export type TransactionToImport = {
  sourceFile: string;
  transaction: Transaction;
  actionTaken?: "imported" | "skipped";
}

export interface ImportTransactionsState {
  state: "selectFiles" |
    "parsingFiles" |
    "loadingTransactions" |
    "importingTransactions";
  error?: string;
  transactionsIndex: number;
  transactionsToImport: TransactionToImport[],
  existingTransactions: Transaction[],
}

const initialState: ImportTransactionsState = {
  state: "selectFiles",
  transactionsIndex: 0,
  transactionsToImport: [],
  existingTransactions: [],
};

export const importTransactionsSlice = createSlice({
  name: "importTransactions",
  initialState,
  reducers: {
    nextTransaction: (state) => {
      if (state.transactionsIndex < state.transactionsToImport.length) {
        state.transactionsIndex += 1;
      }
    },

    previousTransaction: (state) => {
      if (state.transactionsIndex > 0) {
        state.transactionsIndex -= 1;
      }
    },

    updateImportTransactionsState:
    (state, action: PayloadAction<ImportTransactionsState["state"]>) => { state.state = action.payload; },

    updateTransactionsToImport:
    (state, action: PayloadAction<TransactionToImport[]>) => { state.transactionsToImport = action.payload; },

    updateExistingTransactions:
    (state, action: PayloadAction<Transaction[]>) => { state.existingTransactions = action.payload; },

    clearImportTransactionsState: () => initialState,
  },

  extraReducers: (builder) => {
    builder
      .addCase(parseFiles.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

const dateRange = 5;

export const parseFiles = createAsyncThunk(
  "import/parseFiles",
  async (files: FileList, thunkApi) => {
    thunkApi.dispatch(updateImportTransactionsState("parsingFiles"));
    const transactionsToImport = await parseTransactions(files);
    thunkApi.dispatch(updateTransactionsToImport(transactionsToImport));
    thunkApi.dispatch(updateImportTransactionsState("loadingTransactions"));
    if (transactionsToImport.length === 0) {
      thunkApi.dispatch(updateImportTransactionsState("importingTransactions"));
      return;
    }
    const existingTransactions = await api.listTransactionsInDateRange(
      subDays(transactionsToImport[0].transaction.date ?? 0, dateRange).getTime(),
      addDays(transactionsToImport[transactionsToImport.length - 1].transaction.date ?? 0, dateRange)
        .getTime(),
    );
    thunkApi.dispatch(updateExistingTransactions(existingTransactions));
    thunkApi.dispatch(updateImportTransactionsState("importingTransactions"));
  },
);

export const {
  updateImportTransactionsState,
  updateTransactionsToImport,
  updateExistingTransactions,
  nextTransaction,
  previousTransaction,
  clearImportTransactionsState,
} = importTransactionsSlice.actions;

export const selectImportTransactions = (state: RootState) => state.importTransactions;

export const selectCurrentImportTransaction = (state: RootState) => {
  const index = state.importTransactions.transactionsIndex;
  const transactions = state.importTransactions.transactionsToImport;
  if (index >= transactions.length) {
    return undefined;
  }
  return transactions[index];
};

export default importTransactionsSlice.reducer;
