import { useState } from "react";
import {
  CircularProgress, List, ListItem, ListItemText, Stack, Typography, Button, Divider,
  IconButton,
} from "@mui/material";
import { Add, Edit } from "@mui/icons-material";
import { useListImportAutoActionRulesQuery } from "../../lib/budget/budgetAPI";
import ImportRuleDialog
  from "../../ui/settings/importRules/ImportRuleDialog";
import { updateImportRuleFormState, clearImportRuleFormState } from "../../lib/import/importRuleSlice";
import { useAppDispatch } from "../../lib/store/hooks";
import DeleteRuleDialog from "../../ui/settings/importRules/DeleteRuleDialog";

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

                      <DeleteRuleDialog id={r.id ?? ""} />

                    </Stack>
                  )}
                >
                  <Stack justifyContent="space-between" direction="row" sx={{ width: "100%" }}>
                    <ListItemText>If transaction matches&nbsp;
                      <Typography
                        sx={{ fontWeight: "bold" }}
                        component="span"
                      >{r.filter}
                      </Typography>
                    </ListItemText>

                    {r.action?.action === "skip"
                    && <ListItemText>Skip transaction</ListItemText>}

                    {r.action?.action === "assignCategory"
                  && (
                  <ListItemText>Assign category&nbsp;
                    <Typography
                      sx={{ fontWeight: "bold" }}
                      component="span"
                    >{r.action?.categoryName}
                    </Typography>
                  </ListItemText>
                  )}
                  </Stack>
                </ListItem>
              ))}
          </List>

        </Stack>
      )}
      <ImportRuleDialog
        open={openDialog}
        onClose={() => {
          dispatch(clearImportRuleFormState());
          setOpenDialog(false);
        }}
        onRuleSaved={() => {
          dispatch(clearImportRuleFormState());
          setOpenDialog(false);
        }}
      />
    </Stack>
  );
};
export default Import;
