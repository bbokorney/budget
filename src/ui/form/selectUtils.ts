import { Category, Tag } from "../../lib/budget/models";
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

export function selectOptionsFromTags(
  tags: Tag[] | undefined,
): FormSelectOption[] | undefined {
  return tags?.map(
    (t) => ({ id: t.id ?? "", value: t.name ?? "", displayValue: t.name ?? "" }),
  );
}

export function optionsFromTagNames(
  names?: string[],
  tagOptions?: FormSelectOption[],
): FormSelectOption[] | undefined {
  const options: FormSelectOption[] = [];
  names?.forEach((n) => {
    const found = tagOptions?.find((option) => n === option?.value);
    if (found) {
      options.push(found);
    }
  });
  return options;
}
