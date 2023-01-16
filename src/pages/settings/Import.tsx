import { useState } from "react";
import {
  CircularProgress, List, ListItem, ListItemText, Stack, Typography, Button, Divider,
  IconButton,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import { useListImportAutoActionRulesQuery } from "../../lib/budget/budgetAPI";
import ImportRuleDialog from "./ImportRuleDialog";
import { updateImportRuleFormState } from "../../lib/import/importRuleSlice";
import { useAppDispatch } from "../../lib/store/hooks";

const Import = () => {
  const dispatch = useAppDispatch();
  const [openDialog, setOpenDialog] = useState(false);

  const onAddButtonClicked = () => {
    setOpenDialog(true);
  };

  const { data: rules, isLoading } = useListImportAutoActionRulesQuery();

  return (
    <Stack>
      <Typography variant="h6">
        Import settings
      </Typography>

      <Stack alignItems="center">
        {isLoading && <CircularProgress /> }
      </Stack>

      {rules && (
        <Stack sx={{ pt: 1, width: "100%", maxWidth: "1000px" }}>

          <Divider sx={{ mt: 1, mb: 2 }} />

          <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center">

            <Typography component="span">
              Auto-action rules
            </Typography>

            <Stack direction="row" alignItems="center">
              <Button
                color="secondary"
                variant="contained"
                onClick={onAddButtonClicked}
                startIcon={<Add />}
              >
                Add Rule
              </Button>
            </Stack>

          </Stack>

          <List>
            {rules && rules
              .map((r) => (
                <ListItem
                  key={r.id}
                  secondaryAction={(
                    <Stack direction="row" spacing={1}>
                      <IconButton
                        edge="end"
                        onClick={() => {
                          dispatch(updateImportRuleFormState({ rule: r, formActionType: "Edit" }));
                          setOpenDialog(true);
                        }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton edge="end">
                        <Delete />
                      </IconButton>
                    </Stack>
                  )}
                >
                  <Stack justifyContent="space-between" direction="row" sx={{ width: "100%" }}>
                    <ListItemText>Filter: {r.filter}</ListItemText>
                    <ListItemText>Action: {r.actionType}</ListItemText>
                    {r.actionType === "assignCategory"
                  && <ListItemText>{r.actionArgs?.categoryName}</ListItemText>}
                  </Stack>
                </ListItem>
              ))}
          </List>

        </Stack>
      )}
      <ImportRuleDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onRuleSaved={() => setOpenDialog(false)}
      />
    </Stack>
  );
};
export default Import;
