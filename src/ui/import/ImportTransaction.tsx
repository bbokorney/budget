import {
  Box, Stack, Button, Typography, LinearProgress,
} from "@mui/material";
import {
  selectImportTransactions,
  nextTransaction,
  previousTransaction,
} from "../../lib/import/importSlice";
import { useAppDispatch, useAppSelector } from "../../lib/store/hooks";
import formatDate from "../../lib/dates/format";
import { formatCurrency } from "../../lib/currency/format";

const ImportTransaction = () => {
  const dispatch = useAppDispatch();

  const {
    state,
    transactionsIndex: index,
    transactionsToImport,
  } = useAppSelector(selectImportTransactions);
  if (state === "endOfTransactions") {
    return <Typography>End of transactions</Typography>;
  }
  const currentTransaction = transactionsToImport[index];
  const progress = 100 * (index / transactionsToImport.length);

  return (
    <Stack spacing={1}>
      <Stack direction="row" spacing={1}>
        <Typography>
          {`${index + 1} of ${transactionsToImport.length}`}
        </Typography>
      </Stack>

      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box sx={{ width: "100%", mr: 1 }}>
          <LinearProgress variant="determinate" value={progress} />
        </Box>
      </Box>
      <Stack direction="row">
        <Typography>
          {`From ${currentTransaction.sourceFile}`}
        </Typography>
      </Stack>
      <Stack direction="row" spacing={1}>
        <Typography>
          {formatDate(currentTransaction.transaction.date)}
        </Typography>
        <Typography sx={{ fontWeight: "bold" }}>
          {formatCurrency(-1 * (currentTransaction.transaction.amount ?? 0))}
        </Typography>
      </Stack>
      <Stack direction="row" spacing={1}>
        <Typography>
          {currentTransaction.transaction.vendor}
        </Typography>
      </Stack>
      <Stack direction="row" spacing={1}>
        <Button
          color="secondary"
          variant="contained"
          onClick={() => dispatch(previousTransaction())}
        >
          Previous
        </Button>
        <Button
          color="secondary"
          variant="contained"
          onClick={() => dispatch(nextTransaction())}
        >
          Next
        </Button>
      </Stack>
    </Stack>
  );
};

export default ImportTransaction;
