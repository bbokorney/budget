export interface Transaction {
  id?: string;
  amount?: number;
  date?: number;
  category?: string;
  vendor?: string;
  notes?: string;
  tags?: string[];
  source?: string;
  importId?: string;
}

export interface Category {
  id?: string;
  name?: string;
}

export interface Tag {
  id?: string;
  name?: string;
}

export type SkipAction = {
  action: "skip";
};

export type AssignCategoryAction = {
  action: "assignCategory";
  categoryName: string;
};

export interface ImportAutoActionRule {
  id?: string;
  filter?: string;
  action?: SkipAction | AssignCategoryAction;
}
