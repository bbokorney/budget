import {
  Stack, Button,
} from "@mui/material";
import { ArrowForward, ArrowBack } from "@mui/icons-material";
import {
  nextTransaction,
  previousTransaction,
  selectCurrentImportTransaction,
  selectImportTransactions,
} from "../../lib/import/importSlice";
import { useAppDispatch, useAppSelector } from "../../lib/store/hooks";
import SaveButton from "./SaveButton";

const ActionButtons = () => {
  const dispatch = useAppDispatch();
  const transaction = useAppSelector(selectCurrentImportTransaction);
  const { transactionsIndex } = useAppSelector(selectImportTransactions);

  return (
    <Stack direction="row" spacing={1}>
      <Button
        color="secondary"
        variant="contained"
        onClick={() => dispatch(previousTransaction())}
        startIcon={<ArrowBack />}
        disabled={transactionsIndex === 0}
      >
        Back
      </Button>

      <SaveButton />

      <Button
        color="secondary"
        variant="contained"
        onClick={() => dispatch(nextTransaction("skipped"))}
        endIcon={<ArrowForward />}
        disabled={!transaction}
      >
        {transaction?.actionTaken === "skipped" ? "Next" : "Skip"}
      </Button>
    </Stack>
  );
};

export default ActionButtons;
