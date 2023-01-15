import {
  Stack, Typography, Divider,
} from "@mui/material";
import {
  selectCurrentImportTransaction,
  selectSimilarTransactions,
} from "../../lib/import/importSlice";
import { useAppSelector } from "../../lib/store/hooks";
import ProgressIndicator from "./ProgressIndicator";
import ActionTakenAlert from "./ActionTakenAlert";
import TransactionView from "./TransactionView";
import ActionButtons from "./ActionButtons";

const ImportTransaction = () => {
  const currentTransaction = useAppSelector(selectCurrentImportTransaction);

  const similarTransactions = useAppSelector((state) => selectSimilarTransactions(state, currentTransaction));

  return (
    <Stack spacing={2}>

      <ProgressIndicator />

      <ActionButtons />

      <ActionTakenAlert />

      <Divider />

      {currentTransaction
        ? (
          <TransactionView
            sourceFile={currentTransaction.sourceFile}
            transaction={currentTransaction.transaction}
          />
        ) : <Typography>End of transactions</Typography>}

      <Divider />

      {currentTransaction && similarTransactions.length > 0
      && <Typography>Similar transactions</Typography>}

      {similarTransactions.map((t) => <TransactionView key={t.id} transaction={t} />)}

      {currentTransaction && similarTransactions.length === 0
      && <Typography>No similar transactions</Typography>}

    </Stack>
  );
};

export default ImportTransaction;
