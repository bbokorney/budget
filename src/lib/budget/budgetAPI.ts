import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Transaction } from "./models";
import BudgetFirebaseAPI from "./budgetFirebaseAPI";

const api = new BudgetFirebaseAPI();

export const budgetApi = createApi({
  reducerPath: "budgetApi",
  baseQuery: fetchBaseQuery({}),
  endpoints: (builder) => ({
    listTransactions: builder.query<Transaction[], string | undefined>({
      async queryFn(after) {
        return { data: await api.listTransactions(after) };
      },
    }),
  }),
});

export const { useListTransactionsQuery } = budgetApi;
