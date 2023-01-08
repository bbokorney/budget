import React from "react";
import {
  Alert, Box, Stack, Button, Typography, LinearProgress, Divider,
} from "@mui/material";
import { ArrowForward, ArrowBack, Save } from "@mui/icons-material";
import {
  selectImportTransactions,
  nextTransaction,
  previousTransaction,
  selectCurrentImportTransaction,
  selectSimilarTransactions,
} from "../../lib/import/importSlice";
import { useAppDispatch, useAppSelector } from "../../lib/store/hooks";
import formatDate from "../../lib/dates/format";
import { formatCurrency } from "../../lib/currency/format";
import { Transaction } from "../../lib/budget/models";

const ImportTransaction = () => {
  const dispatch = useAppDispatch();

  const {
    transactionsIndex: index,
    transactionsToImport,
  } = useAppSelector(selectImportTransactions);

  const progress = 100 * (index / transactionsToImport.length);

  const currentTransaction = useAppSelector(selectCurrentImportTransaction);

  const similarTransactions = useAppSelector((state) => selectSimilarTransactions(state, currentTransaction));

  const actionTakenMessage = () => {
    if (!currentTransaction) {
      return <div />;
    }
    switch (currentTransaction.actionTaken) {
      case "saved":
      case "skipped":
        return <Alert severity="info">This transaction was already {currentTransaction.actionTaken}.</Alert>;
      default:
        return <div />;
    }
  };

  return (
    <Stack spacing={1}>
      <Stack direction="row" spacing={1}>
        <Typography>
          {`${Math.min(index + 1, transactionsToImport.length)} of ${transactionsToImport.length}`}
        </Typography>
      </Stack>

      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box sx={{ width: "100%", mr: 1 }}>
          <LinearProgress variant="determinate" value={progress} />
        </Box>
      </Box>

      <Stack direction="row" spacing={1}>
        <Button
          color="secondary"
          variant="contained"
          onClick={() => dispatch(previousTransaction())}
          startIcon={<ArrowBack />}
        >
          Back
        </Button>
        <Button
          color="secondary"
          variant="contained"
          onClick={() => dispatch(nextTransaction("saved"))}
          endIcon={<Save />}
        >
          Save
        </Button>
        <Button
          color="secondary"
          variant="contained"
          onClick={() => dispatch(nextTransaction("skipped"))}
          endIcon={<ArrowForward />}
        >
          Skip
        </Button>
      </Stack>

      {currentTransaction && actionTakenMessage()}

      <Divider sx={{ pt: 1 }} />

      {currentTransaction
        ? (
          <TransactionView
            sourceFile={currentTransaction.sourceFile}
            transaction={currentTransaction.transaction}
          />
        ) : <Typography>End of transactions</Typography>}

      <Divider sx={{ pt: 1 }} />

      {similarTransactions.map((t) => <TransactionView transaction={t} />)}

      {currentTransaction && similarTransactions.length === 0
      && <Typography>No similar transactions</Typography>}

    </Stack>
  );
};

export default ImportTransaction;

type TransactionViewProps = {
  sourceFile?: string;
  transaction: Transaction;
}

const TransactionView: React.FC<TransactionViewProps> = ({
  sourceFile, transaction,
}) => (
  <>
    <Stack direction="row">
      {sourceFile
      && (
      <Typography>
        {`From ${sourceFile}`}
      </Typography>
      )}
    </Stack>
    <Stack direction="row" spacing={1}>
      <Typography>
        {formatDate(transaction.date)}
      </Typography>
      <Typography sx={{ fontWeight: "bold" }}>
        {formatCurrency(-1 * (transaction.amount ?? 0))}
      </Typography>
    </Stack>
    <Stack direction="row" spacing={1}>
      <Typography>
        {transaction.vendor}
      </Typography>
    </Stack>
  </>
);
