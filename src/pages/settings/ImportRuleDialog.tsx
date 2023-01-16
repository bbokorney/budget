import React, { useState, useEffect } from "react";
import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle, Select,
  Backdrop, Typography, CircularProgress, FormControl, Stack, TextField,
  MenuItem, InputLabel,
} from "@mui/material";
import { Check } from "@mui/icons-material";
import { useListCategoriesQuery, useUpsertImportAutoActionRuleMutation } from "../../lib/budget/budgetAPI";
import { ImportAutoActionRule } from "../../lib/budget/models";
import FormSelect from "../../ui/form/FormSelect";
import selectOptionsFromCategories from "../../ui/form/categoriesSelect";

type ImportRuleDialogProps = {
  open: boolean;
  onClose: () => void;
  onRuleSaved: () => void;
}

const ImportRuleDialog: React.FC<ImportRuleDialogProps> = ({ open, onClose, onRuleSaved }) => {
  const [saveButtonEnabled, setSaveButtonEnabled] = useState(false);
  const [filter, setFilter] = useState("");
  const [actionType, setActionType] = useState<ImportAutoActionRule["actionType"] | string>("");
  const [actionArgs, setActionArgs] = useState<Record<string, string>>({});

  const [
    upsertRule,
    {
      isSuccess: isUpsertSuccess, isLoading: isUpserting, isUninitialized, reset,
    },
  ] = useUpsertImportAutoActionRuleMutation();

  const { data: categories, isLoading: isCategoriesLoading } = useListCategoriesQuery();
  const categoryOptions = selectOptionsFromCategories(categories);

  const onSaveButtonClicked = () => {
    upsertRule({ filter, actionType: actionType as ImportAutoActionRule["actionType"], actionArgs });
  };

  const isRuleValid = (r: ImportAutoActionRule) => {
    if (!r.filter || !r.actionType) {
      return false;
    }
    if (r.actionType === "assignCategory" && !r.actionArgs?.categoryName) {
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (isUpsertSuccess) {
      setTimeout(() => {
        onRuleSaved();
        reset();
      }, 1000);
    }
  }, [isUpsertSuccess]);

  const backdropOpen = open && (isCategoriesLoading || isUpserting || isUpsertSuccess);

  const formControlSx = { m: 1, minWidth: 120 };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
    >
      <DialogTitle>
        Add import action rule
      </DialogTitle>
      <DialogContent>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={backdropOpen}
        >
          <Stack spacing={2} alignItems="center">
            {isUpsertSuccess ? <Check color="primary" /> : <CircularProgress /> }
            {!isUninitialized && <Typography>{isUpsertSuccess ? "Rule saved" : "Saving..."}</Typography>}
          </Stack>
        </Backdrop>
        <Stack sx={{ mt: 1 }}>

          <FormControl sx={formControlSx}>
            <TextField
              label="Match filter"
              onChange={(e) => {
                const newFilter = e.target.value;
                setFilter(newFilter);
                setSaveButtonEnabled(
                  isRuleValid(
                    {
                      filter: newFilter,
                      actionType: actionType as ImportAutoActionRule["actionType"],
                      actionArgs,
                    },
                  ),
                );
              }}
            />
          </FormControl>

          <FormControl sx={formControlSx}>
            <InputLabel>Action type</InputLabel>
            <Select
              label="Action type"
              value={actionType}
              onChange={(e) => {
                const a = e.target.value as ImportAutoActionRule["actionType"];
                setActionType(a);
                if (a === "skip") {
                  setActionArgs({});
                }
                setSaveButtonEnabled(
                  isRuleValid(
                    { filter, actionType: a, actionArgs },
                  ),
                );
              }}
            >
              <MenuItem value="skip">Skip</MenuItem>
              <MenuItem value="assignCategory">Assign category</MenuItem>
            </Select>
          </FormControl>

          {actionType === "assignCategory"
          && (
          <FormControl sx={formControlSx}>
            <FormSelect
              label="Category"
              options={categoryOptions ?? []}
              onChange={(option) => {
                const newArgs = { categoryName: option?.value ?? "" };
                setActionArgs(newArgs);
                setSaveButtonEnabled(
                  isRuleValid(
                    {
                      filter,
                      actionType: actionType as ImportAutoActionRule["actionType"],
                      actionArgs: newArgs,
                    },
                  ),
                );
              }}
            />
          </FormControl>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={onSaveButtonClicked} autoFocus disabled={!saveButtonEnabled}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImportRuleDialog;
