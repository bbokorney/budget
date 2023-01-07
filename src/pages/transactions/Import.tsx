import {
  CircularProgress, Stack, Typography,
} from "@mui/material";
import SelectFiles from "../../ui/import/SelectFiles";
import ResetDialog from "../../ui/import/ResetDialog";
import { selectImportTransactions } from "../../lib/import/importSlice";
import { useAppSelector } from "../../lib/store/hooks";

const TransactionsImport = () => {
  const { state } = useAppSelector(selectImportTransactions);

  let showLoading = false;
  let loadingMessage = "";
  switch (state) {
    case "parsingFiles":
      showLoading = true;
      loadingMessage = "Reading files...";
      break;
    default:
  }

  return (
    <Stack spacing={1} sx={{ mt: 1 }}>
      <Stack direction="row" justifyContent="space-around">
        <Typography variant="h6">
          Import transactions
        </Typography>
        <ResetDialog />
      </Stack>

      {state === "selectFiles" && <SelectFiles />}

      {showLoading
      && (
      <Stack direction="row" justifyContent="space-around">
        <Stack>
          <CircularProgress />
          <Typography>
            {loadingMessage}
          </Typography>
        </Stack>
      </Stack>
      )}

    </Stack>
  );
};
export default TransactionsImport;
