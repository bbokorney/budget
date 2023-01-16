import { Category } from "../../lib/budget/models";
import { FormSelectOption } from "./FormSelect";

export function selectOptionsFromCategories(
  categories: Category[] | undefined,
): FormSelectOption[] | undefined {
  return categories?.map(
    (c) => ({ id: c.id ?? "", value: c.name ?? "", displayValue: c.name ?? "" }),
  );
}

export function optionFromCategoryName(name?: string, categoryOptions?: FormSelectOption[]) {
  if (!name) {
    return null;
  }
  return categoryOptions?.find((option) => name === option?.value);
}
