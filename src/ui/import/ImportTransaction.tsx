import {
  Stack, Typography, Divider, Button,
} from "@mui/material";
import {
  selectCurrentImportTransaction,
  selectSimilarTransactions,
  matchCurrentTransaction,
} from "../../lib/import/importSlice";
import { useAppSelector, useAppDispatch } from "../../lib/store/hooks";
import ProgressIndicator from "./ProgressIndicator";
import ActionTakenAlert from "./ActionTakenAlert";
import TransactionView from "./TransactionView";
import ActionButtons from "./ActionButtons";
import { Transaction } from "../../lib/budget/models";

const ImportTransaction = () => {
  const dispatch = useAppDispatch();
  const currentTransaction = useAppSelector(selectCurrentImportTransaction);

  const similarTransactions = useAppSelector((state) => selectSimilarTransactions(state, currentTransaction));

  const matchTransaction = (transaction: Transaction) => {
    dispatch(matchCurrentTransaction({ transaction }));
  };

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

      {similarTransactions.map((t) => (
        <TransactionView
          key={t.id}
          transaction={t}
          button={(
            <Button
              variant="contained"
              disabled={t.importId === currentTransaction?.transaction.importId}
              onClick={() => matchTransaction(t)}
            >Match Transaction
            </Button>
          )}
        />
      ))}

      {currentTransaction && similarTransactions.length === 0
      && <Typography>No similar transactions</Typography>}

    </Stack>
  );
};

export default ImportTransaction;
