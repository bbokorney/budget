import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store/store";
import { Transaction } from "../budget/models";
import parseTransactions from "./fileParsing";

export type TransactionToImport = {
  sourceFile: string;
  transaction: Transaction;
}

export interface ImportTransactionsState {
  state: "selectFiles" |
    "parsingFiles" |
    "loadingTransactions" |
    "importingTransactions" |
    "endOfTransactions";
  error: string | undefined;
  transactionsIndex: number;
  transactionsToImport: TransactionToImport[],
}

const initialState: ImportTransactionsState = {
  state: "selectFiles",
  error: undefined,
  transactionsIndex: 0,
  transactionsToImport: [],
};

export const importTransactionsSlice = createSlice({
  name: "importTransactions",
  initialState,
  reducers: {
    updateImportTransactionsState:
    (state, action: PayloadAction<ImportTransactionsState["state"]>) => { state.state = action.payload; },

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
    const transactions = await parseTransactions(files);
    console.log(transactions);
  },
);

export const {
  updateImportTransactionsState, clearImportTransactionsState,
} = importTransactionsSlice.actions;

export const selectImportTransactions = (state: RootState) => state.importTransactions;

export default importTransactionsSlice.reducer;
