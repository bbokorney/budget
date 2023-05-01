import {
  Box, Stack, Typography, LinearProgress, Checkbox, FormControlLabel,
} from "@mui/material";
import { useAppSelector, useAppDispatch } from "../../lib/store/hooks";
import {
  selectImportTransactions,
  updateHideImported,
} from "../../lib/import/importSlice";

const ProgressIndicator = () => {
  const dispatch = useAppDispatch();

  const {
    transactionsIndex: index,
    transactionsToImport,
    hideImported,
  } = useAppSelector(selectImportTransactions);

  const progress = 100 * (index / transactionsToImport.length);

  const onClickHide = () => {
    dispatch(updateHideImported(!hideImported));
  };

  return (
    <>
      <Stack direction="row" spacing={1} alignItems="center">

        <Typography>
          {`${Math.min(index + 1, transactionsToImport.length)} of ${transactionsToImport.length}`}
        </Typography>

        <FormControlLabel
          control={<Checkbox onClick={onClickHide} checked={hideImported} />}
          label="Hide imported transactions"
        />

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
