import { Category } from "../../lib/budget/models";
import { FormSelectOption } from "./FormSelect";

export default function selectOptionsFromCategories(
  categories: Category[] | undefined,
): FormSelectOption[] | undefined {
  return categories?.map(
    (c) => ({ id: c.id ?? "", value: c.name ?? "", displayValue: c.name ?? "" }),
  );
}
