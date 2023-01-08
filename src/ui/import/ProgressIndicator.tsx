import {
  Box, Stack, Typography, LinearProgress,
} from "@mui/material";
import { useAppSelector } from "../../lib/store/hooks";
import {
  selectImportTransactions,
} from "../../lib/import/importSlice";

const ProgressIndicator = () => {
  const {
    transactionsIndex: index,
    transactionsToImport,
  } = useAppSelector(selectImportTransactions);

  const progress = 100 * (index / transactionsToImport.length);
  return (
    <>
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
    </>
  );
};

export default ProgressIndicator;
