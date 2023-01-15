import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { subDays, addDays, isWithinInterval } from "date-fns";
import { RootState } from "../store/store";
import { Transaction } from "../budget/models";
import parseTransactions from "./fileParsing";
import BudgetFirebaseAPI from "../budget/budgetFirebaseAPI";
import { budgetApi } from "../budget/budgetAPI";

const api = new BudgetFirebaseAPI();

export type TransactionToImport = {
  sourceFile: string;
  transaction: Transaction;
  actionTaken?: "saved" | "skipped";
  savedTransactionId?: string;
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

type UpdateTransactionSavedIdArgs = {
  index: number;
  id: string | undefined;
}

type UpdateTransactionActionTakenArgs = {
  index: number;
  actionTaken: TransactionToImport["actionTaken"]
}

export const importTransactionsSlice = createSlice({
  name: "importTransactions",
  initialState,
  reducers: {
    nextTransaction: (state, action: PayloadAction<TransactionToImport["actionTaken"]>) => {
      if (state.transactionsIndex < state.transactionsToImport.length) {
        state.transactionsToImport[state.transactionsIndex].actionTaken = action.payload;
        state.transactionsIndex += 1;
      }
    },

    previousTransaction: (state) => {
      if (state.transactionsIndex > 0) {
        state.transactionsIndex -= 1;
      }
    },

    updateTransactionSavedId:
    (state, action: PayloadAction<UpdateTransactionSavedIdArgs>) => {
      state.transactionsToImport[action.payload.index].savedTransactionId = action.payload.id;
    },

    updateTransactionActionTaken:
    (state, action: PayloadAction<UpdateTransactionActionTakenArgs>) => {
      state.transactionsToImport[action.payload.index].actionTaken = action.payload.actionTaken;
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

export type ImportTransactionArgs = {
  transaction: Transaction;
  mutationFixedCacheKey: string;
}

export const importCurrentTransaction = createAsyncThunk(
  "import/importCurrentTransaction",
  async (args: ImportTransactionArgs, thunkApi) => {
    const index = selectImportTransactions(thunkApi.getState() as RootState).transactionsIndex;
    const result = thunkApi.dispatch(
      budgetApi.endpoints.upsertTransaction.initiate(
        args.transaction,
        { fixedCacheKey: args.mutationFixedCacheKey },
      ),
    );

    const newTransaction = await result.unwrap();
    thunkApi.dispatch(updateTransactionSavedId({ index, id: newTransaction.id ?? "" }));
  },
);

export type DeleteImportedTransactionArgs = {
  transactionId: string |undefined;
  fixedCacheKey: string;
  index: number;
}

export const deleteImportedTransaction = createAsyncThunk(
  "import/importCurrentTransaction",
  async (args: DeleteImportedTransactionArgs, thunkApi) => {
    const { index, transactionId, fixedCacheKey } = args;
    if (!transactionId) {
      return;
    }
    const result = thunkApi.dispatch(
      budgetApi.endpoints.deleteTransaction.initiate(
        { id: transactionId },
        { fixedCacheKey },
      ),
    );

    await result.unwrap();
    result.reset();
    thunkApi.dispatch(updateTransactionSavedId({ index, id: undefined }));
    thunkApi.dispatch(updateTransactionActionTaken({ index, actionTaken: undefined }));
  },
);

export const {
  updateImportTransactionsState,
  updateTransactionsToImport,
  updateExistingTransactions,
  nextTransaction,
  previousTransaction,
  clearImportTransactionsState,
  updateTransactionSavedId,
  updateTransactionActionTaken,
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

const dateRange = 5;
const amountRatio = 0.05;

export const selectSimilarTransactions = (state: RootState, toImport?: TransactionToImport) => {
  if (!toImport) {
    return [];
  }

  const startDate = subDays(toImport.transaction.date ?? 0, dateRange);
  const endDate = addDays(toImport.transaction.date ?? 0, dateRange);
  const amount = -1 * (toImport.transaction.amount ?? 0);
  const minAmount = amount - (amount * amountRatio);
  const maxAmount = amount + (amount * amountRatio);
  return state.importTransactions.existingTransactions
    .filter((t) => isWithinInterval(t.date ?? 0, { start: startDate, end: endDate }))
    .filter((t) => {
      const a = t.amount ?? 0;
      return a >= minAmount && a <= maxAmount;
    });
};

export default importTransactionsSlice.reducer;
