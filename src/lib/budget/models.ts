export interface Transaction {
  id?: string;
  amount?: number;
  date?: number;
  category?: string;
  vendor?: string;
  notes?: string;
  tags?: string[];
  source?: string;
}

export interface Category {
  id?: string;
  name?: string;
}

export interface ImportAutoActionRule {
  id?: string;
  filter?: string;
  actionType?: "skip" | "assignCategory";
  actionArgs?: Record<string, string>
}
