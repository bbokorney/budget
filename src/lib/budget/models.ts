export interface Transaction {
  id?: string;
  amount?: number;
  date?: number;
  vendor?: string;
  notes?: string;
  tags?: string[];
  source?: string;
}
