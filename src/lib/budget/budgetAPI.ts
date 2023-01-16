import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Transaction, Category, ImportAutoActionRule } from "./models";
import BudgetFirebaseAPI from "./budgetFirebaseAPI";
import { clearListTransactionsPaginationState } from "./paginationSlice";
import { getTotalsByCategory, CategoryTotals } from "./calculations";

const api = new BudgetFirebaseAPI();

export const budgetApi = createApi({
  reducerPath: "budgetApi",
  baseQuery: fetchBaseQuery({}),
  tagTypes: ["Transactions", "Categories", "ImportAutoActionRules"],
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

    getTotalsByCategoryInDateRange: builder.query<CategoryTotals, {startDate: number, endDate: number}>({
      async queryFn({ startDate, endDate }) {
        const transactions = await api.listTransactionsInDateRange(startDate, endDate);
        return { data: getTotalsByCategory(transactions) };
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

    upsertCategory: builder.mutation<Category, Category>({
      async queryFn(c) {
        return { data: await api.upsertCategory(c) };
      },
      invalidatesTags: ["Categories"],
    }),

    listImportAutoActionRules: builder.query<ImportAutoActionRule[], void>({
      async queryFn() {
        return { data: await api.listImportAutoActionRules() };
      },
      providesTags: ["ImportAutoActionRules"],
    }),

    upsertImportAutoActionRule: builder.mutation<ImportAutoActionRule, ImportAutoActionRule>({
      async queryFn(r) {
        return { data: await api.upsertImportAutoActionRule(r) };
      },
      invalidatesTags: ["ImportAutoActionRules"],
    }),
  }),
});

export const {
  useListTransactionsQuery,
  useUpsertTransactionMutation,
  useGetTransactionQuery,
  useGetTotalsByCategoryInDateRangeQuery,
  useDeleteTransactionMutation,
  useListCategoriesQuery,
  useUpsertCategoryMutation,
  useListImportAutoActionRulesQuery,
  useUpsertImportAutoActionRuleMutation,
} = budgetApi;
