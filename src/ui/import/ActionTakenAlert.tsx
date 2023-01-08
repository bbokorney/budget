import {
  Alert, Button, Stack, Typography,
} from "@mui/material";
import {
  selectCurrentImportTransaction,
} from "../../lib/import/importSlice";
import { useAppSelector } from "../../lib/store/hooks";

const ActionTakenAlert = () => {
  const currentTransaction = useAppSelector(selectCurrentImportTransaction);
  if (!currentTransaction) {
    return <div />;
  }
  switch (currentTransaction.actionTaken) {
    case "saved":
      return (
        <Alert severity="info">
          <Stack direction="row" spacing={1}>
            <Typography>
              This transaction was already {currentTransaction.actionTaken}.
            </Typography>
            <Button
              sx={{ padding: 0 }}
              color="secondary"
            >
              Undo
            </Button>
          </Stack>
        </Alert>
      );
    case "skipped":
      return <Alert severity="info">This transaction was already {currentTransaction.actionTaken}.</Alert>;
    default:
      return <div />;
  }
};

export default ActionTakenAlert;
