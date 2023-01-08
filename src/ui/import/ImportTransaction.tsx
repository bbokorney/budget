import {
  Box, Stack, Button, Typography, LinearProgress,
} from "@mui/material";
import {
  selectImportTransactions,
  nextTransaction,
  previousTransaction,
  selectCurrentImportTransaction,
} from "../../lib/import/importSlice";
import { useAppDispatch, useAppSelector } from "../../lib/store/hooks";
import formatDate from "../../lib/dates/format";
import { formatCurrency } from "../../lib/currency/format";

const ImportTransaction = () => {
  const dispatch = useAppDispatch();

  const {
    transactionsIndex: index,
    transactionsToImport,
  } = useAppSelector(selectImportTransactions);

  const currentTransaction = useAppSelector(selectCurrentImportTransaction);

  const progress = 100 * (index / transactionsToImport.length);

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

      {currentTransaction
        ? (
          <>
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
          </>
        ) : <Typography>End of transactions</Typography>}

    </Stack>
  );
};

export default ImportTransaction;
