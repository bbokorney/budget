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
import { selectImportRuleForm, updateImportRuleFormState } from "../../lib/import/importRuleSlice";
import { useAppSelector, useAppDispatch } from "../../lib/store/hooks";

type ImportRuleDialogProps = {
  open: boolean;
  onClose: () => void;
  onRuleSaved: () => void;
}

const ImportRuleDialog: React.FC<ImportRuleDialogProps> = ({ open, onClose, onRuleSaved }) => {
  const dispatch = useAppDispatch();
  const [saveButtonEnabled, setSaveButtonEnabled] = useState(false);
  const { rule } = useAppSelector(selectImportRuleForm);

  const [
    upsertRule,
    {
      isSuccess: isUpsertSuccess, isLoading: isUpserting, isUninitialized, reset,
    },
  ] = useUpsertImportAutoActionRuleMutation();

  const { data: categories, isLoading: isCategoriesLoading } = useListCategoriesQuery();
  const categoryOptions = selectOptionsFromCategories(categories);

  const onSaveButtonClicked = () => {
    upsertRule(rule);
  };

  const updateRule = (r: ImportAutoActionRule) => {
    dispatch(updateImportRuleFormState({ rule: r }));
    setSaveButtonEnabled(isRuleValid(r));
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
      <DialogContent sx={{ minHeight: "500px" }}>
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
              value={rule.filter}
              onChange={(e) => { updateRule({ ...rule, filter: e.target.value }); }}
            />
          </FormControl>

          <FormControl sx={formControlSx}>
            <InputLabel>Action type</InputLabel>
            <Select
              label="Action type"
              value={rule.actionType}
              onChange={(e) => {
                updateRule({ ...rule, actionType: e.target.value as ImportAutoActionRule["actionType"] });
              }}
            >
              <MenuItem value="skip">Skip</MenuItem>
              <MenuItem value="assignCategory">Assign category</MenuItem>
            </Select>
          </FormControl>

          {rule.actionType === "assignCategory"
          && (
          <FormControl sx={formControlSx}>
            <FormSelect
              label="Category"
              options={categoryOptions ?? []}
              onChange={(option) => {
                updateRule({ ...rule, actionArgs: { categoryName: option?.value ?? "" } });
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
