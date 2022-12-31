import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Transaction, Category } from "./models";
import BudgetFirebaseAPI from "./budgetFirebaseAPI";
import { clearListTransactionsPaginationState } from "./paginationSlice";

const api = new BudgetFirebaseAPI();

export const budgetApi = createApi({
  reducerPath: "budgetApi",
  baseQuery: fetchBaseQuery({}),
  tagTypes: ["Transactions", "Categories"],
  endpoints: (builder) => ({
    listTransactions: builder.query<Transaction[], Transaction | undefined>({
      async queryFn(after, queryApi) {
        if (queryApi.forced || after === undefined) {
          after = undefined;
          queryApi.dispatch(clearListTransactionsPaginationState());
          queryApi.dispatch(budgetApi.util.updateQueryData("listTransactions", undefined, (draft) => {
            draft.splice(0, draft.length);
          }));
        }
        return { data: await api.listTransactions(after) };
      },
      serializeQueryArgs: ({ endpointName }) => endpointName,
      merge: (currentCache, newItems) => {
        currentCache.push(...newItems);
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
      providesTags: ["Transactions"],
    }),

    upsertTransaction: builder.mutation<Transaction, Transaction>({
      async queryFn(t) {
        return { data: await api.upsertTransaction(t) };
      },
      invalidatesTags: ["Transactions"],
    }),

    getTransaction: builder.query<Transaction, string>({
      async queryFn(id) {
        return { data: await api.getTransaction(id) };
      },
      providesTags: ["Transactions"],
    }),

    deleteTransaction: builder.mutation<Transaction, Transaction>({
      async queryFn(t) {
        return { data: await api.deleteTransaction(t) };
      },
      invalidatesTags: ["Transactions"],
    }),

    listCategories: builder.query<Category[], void>({
      async queryFn() {
        return { data: await api.listCategories() };
      },
      providesTags: ["Categories"],
    }),
  }),
});

export const {
  useListTransactionsQuery,
  useUpsertTransactionMutation,
  useGetTransactionQuery,
  useListCategoriesQuery,
  useDeleteTransactionMutation,
} = budgetApi;
