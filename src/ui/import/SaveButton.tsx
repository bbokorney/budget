import { useState } from "react";
import {
  Button,
} from "@mui/material";
import { Save } from "@mui/icons-material";
import SaveDialog from "./SaveDialog";
import { useAppDispatch, useAppSelector } from "../../lib/store/hooks";
import { selectCurrentImportTransaction, nextTransaction } from "../../lib/import/importSlice";
import { updateTransactionFormState } from "../../lib/form/transactionFormSlice";
import { useListImportAutoActionRulesQuery } from "../../lib/budget/budgetAPI";
import { ImportAutoActionRule } from "../../lib/budget/models";

const SaveButton = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const dispatch = useAppDispatch();
  const currentTransaction = useAppSelector(selectCurrentImportTransaction);
  const { data: importRules } = useListImportAutoActionRulesQuery();

  const handleDialogOpen = (rules: ImportAutoActionRule[]) => {
    const t = currentTransaction?.transaction;
    if (!t) {
      return;
    }
    const { amount } = t;
    if (!amount) {
      return;
    }

    let category: string | undefined;
    const autoAssignCategoryRule = rules?.find((rule) => {
      if (rule.action?.action !== "assignCategory") {
        return false;
      }
      if (!rule.filter) {
        return false;
      }
      return t.vendor?.startsWith(rule.filter);
    });

    if (autoAssignCategoryRule && autoAssignCategoryRule.action?.action === "assignCategory") {
      category = autoAssignCategoryRule.action?.categoryName;
    }

    dispatch(updateTransactionFormState(
      {
        transaction: {
          ...t,
          category,
          amount: amount * -1,
        },
      },
    ));
    setDialogOpen(true);
  };

  return (
    <>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => handleDialogOpen(importRules ?? [])}
        disabled={!currentTransaction}
        endIcon={<Save />}
      >
        Save
      </Button>
      <SaveDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onTransactionSaved={() => dispatch(nextTransaction("saved"))}
      />
    </>
  );
};

export default SaveButton;
