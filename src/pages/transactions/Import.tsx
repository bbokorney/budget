import {
  Alert, CircularProgress, Stack, Typography,
} from "@mui/material";
import SelectFiles from "../../ui/import/SelectFiles";
import ResetDialog from "../../ui/import/ResetDialog";
import ImportTransaction from "../../ui/import/ImportTransaction";
import { selectImportTransactions } from "../../lib/import/importSlice";
import { useAppSelector } from "../../lib/store/hooks";

const TransactionsImport = () => {
  const { state, error } = useAppSelector(selectImportTransactions);

  let showLoading = false;
  let loadingMessage = "";
  switch (state) {
    case "parsingFiles":
      showLoading = true;
      loadingMessage = "Reading files...";
      break;
    case "loadingTransactions":
      showLoading = true;
      loadingMessage = "Loading transactions...";
      break;
    default:
  }
  if (error) {
    showLoading = false;
  }

  return (
    <Stack spacing={1} sx={{ mt: 1, mb: 2 }}>
      <Stack direction="row" justifyContent="space-around">
        <Typography variant="h6">
          Import transactions
        </Typography>
        <ResetDialog />
      </Stack>

      {error && <Alert severity="error">{error}</Alert>}

      {state === "selectFiles" && <SelectFiles />}

      {showLoading
      && (
      <Stack direction="row" justifyContent="space-around">
        <Stack>
          <CircularProgress sx={{ alignSelf: "center" }} />
          <Typography>
            {loadingMessage}
          </Typography>
        </Stack>
      </Stack>
      )}

      {state === "importingTransactions" && <ImportTransaction /> }

    </Stack>
  );
};
export default TransactionsImport;
