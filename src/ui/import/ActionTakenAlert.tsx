import {
  Alert, Stack, Typography,
} from "@mui/material";
import {
  selectCurrentImportTransaction,
  selectAlreadyImportedTransaction,
} from "../../lib/import/importSlice";
import { useAppSelector } from "../../lib/store/hooks";
import DeleteButton from "./DeleteButton";
import EditButton from "./EditButton";
import TransactionView from "./TransactionView";

const ActionTakenAlert = () => {
  const currentTransaction = useAppSelector(selectCurrentImportTransaction);
  const alreadyImportedTransaction = useAppSelector(selectAlreadyImportedTransaction);
  console.log(alreadyImportedTransaction);

  if (!currentTransaction) {
    return <div />;
  }

  if (alreadyImportedTransaction) {
    let transactionToShowId;
    if (alreadyImportedTransaction) {
      transactionToShowId = alreadyImportedTransaction.id;
    }
    if (currentTransaction.savedTransactionId) {
      transactionToShowId = currentTransaction.savedTransactionId;
    }
    return (
      <Alert severity="info">
        <Stack spacing={1}>
          <Stack direction="row" spacing={1}>
            <Typography>
              This transaction was already saved.
            </Typography>

            <EditButton />

            <DeleteButton />
          </Stack>

          {transactionToShowId
          && <TransactionView transactionId={transactionToShowId} />}
        </Stack>
      </Alert>
    );
  }
  return <div />;
};

export default ActionTakenAlert;
