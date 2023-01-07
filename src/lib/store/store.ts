import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { budgetApi } from "../budget/budgetAPI";
import authReducer from "../auth/authSlice";
import formDialogReducer from "../formDialog/formDialogSlice";
import transactionFormReducer from "../form/transactionFormSlice";
import listTransactionsPaginationReducer from "../budget/paginationSlice";
import importTransactionsReducer from "../import/importSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    formDialog: formDialogReducer,
    listTransactionsPagination: listTransactionsPaginationReducer,
    transactionForm: transactionFormReducer,
    importTransactions: importTransactionsReducer,
    [budgetApi.reducerPath]: budgetApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(budgetApi.middleware),
});

setupListeners(store.dispatch);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
