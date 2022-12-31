import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Transaction, Category } from "./models";
import BudgetFirebaseAPI from "./budgetFirebaseAPI";

const api = new BudgetFirebaseAPI();

export const budgetApi = createApi({
  reducerPath: "budgetApi",
  baseQuery: fetchBaseQuery({}),
  tagTypes: ["Transactions", "Categories"],
  endpoints: (builder) => ({
    listTransactions: builder.query<Transaction[], string | undefined>({
      async queryFn(after) {
        return { data: await api.listTransactions(after) };
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
