import React from "react";
import {
  Stack, Typography,
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

export default TransactionView;
