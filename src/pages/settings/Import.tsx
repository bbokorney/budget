import { useState } from "react";
import {
  CircularProgress, List, ListItem, ListItemText, Stack, Typography, Button, Divider,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { useListImportAutoActionRulesQuery } from "../../lib/budget/budgetAPI";
import ImportRuleDialog from "./ImportRuleDialog";

const Import = () => {
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
        <Stack sx={{ pt: 1, width: "100%", maxWidth: 360 }}>

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
                <ListItem key={r.id}>
                  <ListItemText>{r.actionType}</ListItemText>
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
