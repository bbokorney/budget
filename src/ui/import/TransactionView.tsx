import React from "react";
import {
  Stack, Typography, Divider, CircularProgress,
} from "@mui/material";
import { Transaction } from "../../lib/budget/models";
import formatDate from "../../lib/dates/format";
import { formatCurrency } from "../../lib/currency/format";
import { useGetTransactionQuery } from "../../lib/budget/budgetAPI";

type TransactionViewProps = {
  sourceFile?: string;
  transaction?: Transaction;
  transactionId?: string;
}

const TransactionView: React.FC<TransactionViewProps> = ({
  sourceFile, transaction, transactionId,
}) => (
  <>
    {transactionId && (
      <TransactionFromIdView transactionId={transactionId} sourceFile={sourceFile} />
    )}
    {transaction && (
      <LoadedTransaction transaction={transaction} sourceFile={sourceFile} />
    )}
  </>
);

export default TransactionView;

type TransactionFromIdViewProps = {
  transactionId: string;
  sourceFile?: string;
}

const TransactionFromIdView: React.FC<TransactionFromIdViewProps> = ({ transactionId, sourceFile }) => {
  const { data, isLoading } = useGetTransactionQuery(transactionId);
  return (
    <>
      {isLoading
      && (
      <Stack alignItems="center">
        <CircularProgress />
      </Stack>
      )}
      {data && (
        <LoadedTransaction
          transaction={data}
          sourceFile={sourceFile}
        />
      )}
    </>
  );
};

type LoadedTransactionProps = {
  sourceFile?: string;
  transaction: Transaction;
}

const LoadedTransaction: React.FC<LoadedTransactionProps> = ({ transaction, sourceFile }) => {
  let amount = transaction.amount ?? 0;
  if (amount < 0) {
    amount *= -1;
  }
  return (
    <>
      <Stack direction="row">
        {sourceFile
      && (
      <Typography>
        From <Typography sx={{ fontFamily: "monospace" }} component="span">{sourceFile}</Typography>
      </Typography>
      )}
      </Stack>
      <Stack direction="row" spacing={1}>
        <Typography>
          {formatDate(transaction.date)}
        </Typography>
        <Typography sx={{ fontWeight: "bold" }}>
          {formatCurrency(amount)}
        </Typography>
      </Stack>
      <Stack direction="row" spacing={1} divider={<Divider orientation="vertical" flexItem />}>
        <Typography>
          {transaction.vendor}
        </Typography>
        <Typography>
          {transaction.category}
        </Typography>
      </Stack>
    </>
  );
};
