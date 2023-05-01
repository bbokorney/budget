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
  hideImported: boolean;
  error?: string;
  transactionsIndex: number;
  transactionsToImport: TransactionToImport[],
  existingTransactions: Transaction[],
}

const initialState: ImportTransactionsState = {
  state: "selectFiles",
  hideImported: false,
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
      console.log(action.payload);

      if (state.transactionsIndex === state.transactionsToImport.length) {
        return;
      }

      if (state.hideImported) {
        const index = state.transactionsToImport
          .findIndex((t, i) => i > state.transactionsIndex && t.savedTransactionId === undefined);
        if (index >= 0) {
          state.transactionsIndex = index;
        }
      } else {
        state.transactionsIndex += 1;
      }
    },

    previousTransaction: (state) => {
      if (state.transactionsIndex === 0) {
        return;
      }
      if (state.hideImported) {
        for (let i = state.transactionsIndex - 1; i >= 0; i -= 1) {
          if (state.transactionsToImport[i].savedTransactionId === undefined) {
            state.transactionsIndex = i;
            return;
          }
        }
      } else {
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

    updateHideImported:
    (state, action: PayloadAction<boolean>) => {
      state.hideImported = action.payload;
      if (action.payload) {
        const index = state.transactionsToImport
          .findIndex((t, i) => i > state.transactionsIndex && t.savedTransactionId === undefined);
        if (index >= 0) {
          state.transactionsIndex = index;
        }
      } else {
        state.transactionsIndex = 0;
      }
    },

    clearImportTransactionsState: () => initialState,
  },

  extraReducers: (builder) => {
    builder
      .addCase(parseFiles.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(matchCurrentTransaction.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export const parseFiles = createAsyncThunk(
  "import/parseFiles",
  async (files: FileList, thunkApi) => {
    thunkApi.dispatch(updateImportTransactionsState("parsingFiles"));
    const transactionsToImport = await parseTransactions(files);
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
    transactionsToImport.forEach((toImport) => {
      const match = existingTransactions.find((t) => t.importId === toImport.transaction.importId);
      if (!match) {
        return;
      }
      toImport.savedTransactionId = match.id;
    });
    thunkApi.dispatch(updateTransactionsToImport(transactionsToImport));
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
    const { transactionsIndex } = selectImportTransactions(
      thunkApi.getState() as RootState,
    );
    const result = thunkApi.dispatch(
      budgetApi.endpoints.upsertTransaction.initiate(
        args.transaction,
        { fixedCacheKey: args.mutationFixedCacheKey },
      ),
    );

    const newTransaction = await result.unwrap();
    thunkApi.dispatch(updateTransactionSavedId({ index: transactionsIndex, id: newTransaction.id ?? "" }));
  },
);

export const matchCurrentTransaction = createAsyncThunk(
  "import/matchCurrentTransaction",
  async (args: {transaction: Transaction}, thunkApi) => {
    const { transactionsIndex } = selectImportTransactions(
      thunkApi.getState() as RootState,
    );
    const currentTransaction = selectCurrentImportTransaction(
      thunkApi.getState() as RootState,
    );
    const updatedTransaction = { ...args.transaction, importId: currentTransaction?.transaction.importId };
    const result = thunkApi.dispatch(
      budgetApi.endpoints.upsertTransaction.initiate(
        updatedTransaction,
      ),
    );

    await result.unwrap();
    thunkApi.dispatch(updateTransactionSavedId({
      index: transactionsIndex,
      id: args.transaction.id,
    }));
    const { existingTransactions } = (thunkApi.getState() as RootState).importTransactions;
    const updateIndex = existingTransactions.findIndex((t) => t.id === args.transaction.id);
    const newExistingTransactions = [
      ...existingTransactions.slice(0, updateIndex),
      {
        ...existingTransactions[updateIndex],
        importId: currentTransaction?.transaction.importId,
      },
      ...existingTransactions.slice(updateIndex + 1),
    ];
    thunkApi.dispatch(updateExistingTransactions(newExistingTransactions));
  },
);

export type DeleteImportedTransactionArgs = {
  transactionId: string | undefined;
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
  updateHideImported,
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
    })
    .sort((a, b) => {
      const aDiff = Math.abs(Math.abs(toImport.transaction.amount ?? 0) - Math.abs(a.amount ?? 0));
      const bDiff = Math.abs(Math.abs(toImport.transaction.amount ?? 0) - Math.abs(b.amount ?? 0));
      if (aDiff < bDiff) {
        return -1;
      }
      return 1;
    });
};

export const selectAlreadyImportedTransaction = (state: RootState) => {
  const currentTransaction = selectCurrentImportTransaction(state);
  if (!currentTransaction) {
    return undefined;
  }

  return state.importTransactions.existingTransactions
    .find((t) => t.importId === currentTransaction.transaction.importId
      || t.id === currentTransaction.savedTransactionId);
};

export default importTransactionsSlice.reducer;
