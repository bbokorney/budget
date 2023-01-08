import {
  Alert,
} from "@mui/material";
import {
  selectCurrentImportTransaction,
} from "../../lib/import/importSlice";
import { useAppSelector } from "../../lib/store/hooks";

const ActionTakenAlert = () => {
  const currentTransaction = useAppSelector(selectCurrentImportTransaction);
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

export default ActionTakenAlert;
