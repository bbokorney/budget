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
