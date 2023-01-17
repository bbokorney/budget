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
  if (!currentTransaction) {
    return <div />;
  }

  const alreadyImportedTransaction = useAppSelector(selectAlreadyImportedTransaction);

  if (currentTransaction.actionTaken === "saved"
    || currentTransaction.actionTaken === "skipped"
    || alreadyImportedTransaction) {
    let { actionTaken } = currentTransaction;
    if (currentTransaction.savedTransactionId || alreadyImportedTransaction) {
      actionTaken = "saved";
    }
    let transactionToShow;
    if (alreadyImportedTransaction) {
      transactionToShow = alreadyImportedTransaction;
    }
    return (
      <Alert severity="info">
        <Stack spacing={1}>
          <Stack direction="row" spacing={1}>
            <Typography>
              This transaction was already {actionTaken}.
            </Typography>

            <EditButton />

            <DeleteButton />
          </Stack>

          {transactionToShow
          && <TransactionView transaction={transactionToShow} />}
        </Stack>
      </Alert>
    );
  }
  return <div />;
};

export default ActionTakenAlert;
