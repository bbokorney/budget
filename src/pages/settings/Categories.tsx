import SimpleListForm from "../../ui/form/SimpleListForm";
import { useListCategoriesQuery, useUpsertCategoryMutation } from "../../lib/budget/budgetAPI";

const Categories = () => {
  const { data: categories, isLoading } = useListCategoriesQuery();
  const [
    upsertCategory,
    { isLoading: isUpserting, isSuccess: isUpsertSuccess, reset },
  ] = useUpsertCategoryMutation();

  const onSaveButtonClicked = (newCategory: string) => {
    upsertCategory({ name: newCategory });
  };

  const validateCategory = (newCategory: string): string | undefined => {
    if (newCategory.length > 1) {
      if (categories && categories.find((c) => c.name === newCategory)) {
        return `Category '${newCategory}' already exists`;
      }
      return undefined;
    }
    return "Category must be at least 2 characters";
  };

  const items: string[] = [];
  categories?.forEach((c) => {
    if (c) {
      items.push(c.name ?? "");
    }
  });

  return (
    <SimpleListForm
      title="Categories"
      textFieldLabel="Category name"
      items={items}
      isLoading={isLoading}
      isUpserting={isUpserting}
      isUpsertSuccess={isUpsertSuccess}
      onSaveButtonClicked={onSaveButtonClicked}
      validateItem={validateCategory}
      reset={reset}
    />
  );
};
export default Categories;
