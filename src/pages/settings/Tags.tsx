import { useListTagsQuery, useUpsertTagMutation } from "../../lib/budget/budgetAPI";
import SimpleListForm from "../../ui/form/SimpleListForm";

const Tags = () => {
  const { data: tags, isLoading } = useListTagsQuery();
  const [
    upsertTag,
    { isLoading: isUpserting, isSuccess: isUpsertSuccess, reset },
  ] = useUpsertTagMutation();

  const onSaveButtonClicked = (newTag: string) => {
    upsertTag({ name: newTag });
  };

  const validateTag = (newTag: string): string | undefined => {
    if (newTag.length > 1) {
      if (tags && tags.find((t) => t.name === newTag)) {
        return `Tag '${newTag}' already exists`;
      }
      return undefined;
    }
    return "Tag must be at least 2 characters";
  };

  const items: string[] = [];
  tags?.forEach((t) => {
    if (t) {
      items.push(t.name ?? "");
    }
  });

  return (
    <SimpleListForm
      title="Tags"
      textFieldLabel="Tag name"
      items={items}
      isLoading={isLoading}
      isUpserting={isUpserting}
      isUpsertSuccess={isUpsertSuccess}
      onSaveButtonClicked={onSaveButtonClicked}
      validateItem={validateTag}
      reset={reset}
    />
  );
};
export default Tags;
