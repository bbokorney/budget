import LoadingButton from "@mui/lab/LoadingButton";
import {
  selectCurrentImportTransaction,
} from "../../lib/import/importSlice";
import { useAppSelector } from "../../lib/store/hooks";
import { useDeleteTransactionMutation } from "../../lib/budget/budgetAPI";

const UndoButton = () => {
  const currentTransaction = useAppSelector(selectCurrentImportTransaction);
  const savedTransactionId = currentTransaction?.savedTransactionId;

  const [
    deleteTransaction,
    {
      isLoading: isDeleting, isSuccess: isDeleteSuccess,
    },
  ] = useDeleteTransactionMutation();

  const handleOnClick = () => {
    deleteTransaction({ id: savedTransactionId });
  };

  return (
    <div>
      {savedTransactionId
        ? (
          <LoadingButton
            sx={{ padding: 0 }}
            color="secondary"
            onClick={handleOnClick}
            disabled={isDeleteSuccess}
            loading={isDeleting}
          >
            {isDeleteSuccess ? "Deleted" : "Undo"}
          </LoadingButton>
        ) : <span />}
    </div>
  );
};

export default UndoButton;
