import React, { useState, useEffect } from "react";
import {
  CircularProgress, List, ListItem, ListItemText, Stack, TextField, Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Save } from "@mui/icons-material";
import { useListCategoriesQuery, useUpsertCategoryMutation } from "../../lib/budget/budgetAPI";

const Categories = () => {
  const [newCategory, setNewCategory] = useState("");
  const [newCategoryError, setNewCategoryError] = useState("");
  const [saveButtonEnabled, setSaveButtonEnabled] = useState(false);

  const onCategoryFieldChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const newValue = event.target.value;
    setNewCategory(newValue);
    if (newValue.length > 1) {
      if (categories && categories.find((c) => c.name === newValue)) {
        setNewCategoryError(`Category '${newValue}' already exists`);
        setSaveButtonEnabled(false);
        return;
      }
      setNewCategoryError("");
      setSaveButtonEnabled(true);
    } else {
      setNewCategoryError("Category must be at least 2 characters");
      setSaveButtonEnabled(false);
    }
  };

  const onSaveButtonClicked = () => {
    upsertCategory({ name: newCategory });
  };

  const { data: categories, isLoading } = useListCategoriesQuery();
  const [
    upsertCategory,
    { isLoading: isUpserting, isSuccess: isUpsertSuccess, reset },
  ] = useUpsertCategoryMutation();

  useEffect(() => {
    if (isUpsertSuccess) {
      setTimeout(() => {
        setNewCategory("");
        reset();
      }, 1000);
    }
  }, [isUpsertSuccess]);

  return (
    <Stack>
      <Typography variant="h6">
        Categories
      </Typography>

      <Stack alignItems="center">
        {isLoading && <CircularProgress /> }
      </Stack>

      {categories && (
        <Stack sx={{ pt: 1, width: "100%", maxWidth: 360 }}>

          <Stack direction="row" spacing={1} justifyContent="space-between">

            <TextField
              label="New Category"
              error={newCategoryError !== ""}
              helperText={newCategoryError}
              disabled={isLoading || isUpserting || isUpsertSuccess}
              value={newCategory}
              onChange={onCategoryFieldChange}
            />

            <Stack direction="row" alignItems="center">
              <LoadingButton
                color="secondary"
                variant="contained"
                onClick={onSaveButtonClicked}
                disabled={!saveButtonEnabled || isUpsertSuccess}
                loadingPosition="start"
                startIcon={<Save />}
                loading={isUpserting}
              >
                {isUpsertSuccess ? "Saved" : "Save"}
              </LoadingButton>
            </Stack>

          </Stack>

          <List>
            {categories && categories
              .slice()
              .sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""))
              .map((c) => (
                <ListItem key={c.id}>
                  <ListItemText>{c.name}</ListItemText>
                </ListItem>
              ))}
          </List>

        </Stack>
      )}
    </Stack>
  );
};
export default Categories;
