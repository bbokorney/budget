import {
  Stack, Button,
} from "@mui/material";
import { ArrowForward, ArrowBack } from "@mui/icons-material";
import {
  nextTransaction,
  previousTransaction,
} from "../../lib/import/importSlice";
import { useAppDispatch } from "../../lib/store/hooks";
import SaveDialog from "./SaveDialog";

const ActionButtons = () => {
  const dispatch = useAppDispatch();

  return (
    <Stack direction="row" spacing={1}>
      <Button
        color="secondary"
        variant="contained"
        onClick={() => dispatch(previousTransaction())}
        startIcon={<ArrowBack />}
      >
        Back
      </Button>

      <SaveDialog />

      <Button
        color="secondary"
        variant="contained"
        onClick={() => dispatch(nextTransaction("skipped"))}
        endIcon={<ArrowForward />}
      >
        Skip
      </Button>
    </Stack>
  );
};

export default ActionButtons;
