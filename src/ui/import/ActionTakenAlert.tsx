import {
  Alert, Stack, Typography,
} from "@mui/material";
import {
  selectCurrentImportTransaction,
} from "../../lib/import/importSlice";
import { useAppSelector } from "../../lib/store/hooks";
import DeleteButton from "./DeleteButton";
import EditButton from "./EditButton";

const ActionTakenAlert = () => {
  const currentTransaction = useAppSelector(selectCurrentImportTransaction);
  if (!currentTransaction) {
    return <div />;
  }

  if (currentTransaction.actionTaken === "saved"
    || currentTransaction.actionTaken === "skipped") {
    let { actionTaken } = currentTransaction;
    if (currentTransaction.savedTransactionId) {
      actionTaken = "saved";
    }
    return (
      <Alert severity="info">
        <Stack direction="row" spacing={1}>
          <Typography>
            This transaction was already {actionTaken}.
          </Typography>

          <EditButton />

          <DeleteButton />
        </Stack>
      </Alert>
    );
  }
  return <div />;
};

export default ActionTakenAlert;
