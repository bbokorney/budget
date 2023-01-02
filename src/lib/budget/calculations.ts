import { Transaction } from "./models";

export type CategoryMap = {
  [key: string]: number;
}

export interface CategoryTotal {
  amount: number;
  percentage: number;
  category: string;
}

export interface CategoryTotals {
  total: number;
  categories: CategoryTotal[];
}

export function getTotalsByCategory(transactions: Transaction[]): CategoryTotals {
  let total = 0;
  const categories = new Map<string, number>();
  transactions.forEach((t) => {
    const category = t.category ?? "Unknown";
    const amount = t.amount ?? 0;
    categories.set(category, (categories.get(category) ?? 0) + amount);
    total += amount;
  });
  return {
    total,
    categories: Array.from(categories.entries())
      .map(([category, amount]) => ({ category, amount, percentage: (amount / total) * 100 })),
  };
}
