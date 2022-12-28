import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Transaction, Category } from "./models";
import BudgetFirebaseAPI from "./budgetFirebaseAPI";

const api = new BudgetFirebaseAPI();

export const budgetApi = createApi({
  reducerPath: "budgetApi",
  baseQuery: fetchBaseQuery({}),
  tagTypes: ["Transactions"],
  endpoints: (builder) => ({
    listTransactions: builder.query<Transaction[], string | undefined>({
      async queryFn(after) {
        return { data: await api.listTransactions(after) };
      },
      providesTags: ["Transactions"],
    }),

    upsertTransaction: builder.mutation<Transaction, Transaction>({
      async queryFn(t) {
        return { data: await api.upsert(t) };
      },
      invalidatesTags: ["Transactions"],
    }),

    listCategories: builder.query<Category[], void>({
      async queryFn() {
        return { data: await api.listCategories() };
      },
    }),
  }),
});

export const {
  useListTransactionsQuery,
  useUpsertTransactionMutation,
  useListCategoriesQuery,
} = budgetApi;
