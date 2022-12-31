import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store/store";
import { Transaction } from "./models";

export interface ListTransactionsPaginationState {
  lastTransaction?: Transaction,
}

const initialState: ListTransactionsPaginationState = {
  lastTransaction: undefined,
};

export const listTransactionsPaginationSlice = createSlice({
  name: "listTransactionsPagination",
  initialState,
  reducers: {
    updateListTransactionsPaginationState:
    (_, action: PayloadAction<ListTransactionsPaginationState>) => action.payload,
    clearListTransactionsPaginationState: () => initialState,
  },
});

export const {
  updateListTransactionsPaginationState, clearListTransactionsPaginationState,
} = listTransactionsPaginationSlice.actions;

export const selectListTransactionsPagination = (state: RootState) => state.listTransactionsPagination;

export default listTransactionsPaginationSlice.reducer;
