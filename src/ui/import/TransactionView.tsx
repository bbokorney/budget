import React from "react";
import {
  Stack, Typography, Divider,
} from "@mui/material";
import { Transaction } from "../../lib/budget/models";
import formatDate from "../../lib/dates/format";
import { formatCurrency } from "../../lib/currency/format";

type TransactionViewProps = {
  sourceFile?: string;
  transaction: Transaction;
}

const TransactionView: React.FC<TransactionViewProps> = ({
  sourceFile, transaction,
}) => {
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

export default TransactionView;
