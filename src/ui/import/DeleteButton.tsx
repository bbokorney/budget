import LoadingButton from "@mui/lab/LoadingButton";
import {
  selectCurrentImportTransaction,
  selectImportTransactions,
  deleteImportedTransaction,
} from "../../lib/import/importSlice";
import { useAppSelector, useAppDispatch } from "../../lib/store/hooks";
import { useDeleteTransactionMutation } from "../../lib/budget/budgetAPI";

const DeleteButton = () => {
  const fixedCacheKey = "import-transactions-delete";
  const dispatch = useAppDispatch();
  const { transactionsIndex } = useAppSelector(selectImportTransactions);
  const currentTransaction = useAppSelector(selectCurrentImportTransaction);
  const savedTransactionId = currentTransaction?.savedTransactionId;

  const [
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
    _,
    {
      isLoading: isDeleting, isSuccess: isDeleteSuccess,
    },
  ] = useDeleteTransactionMutation({ fixedCacheKey });

  const handleOnClick = () => {
    dispatch(deleteImportedTransaction(
      {
        transactionId: savedTransactionId,
        index: transactionsIndex,
        fixedCacheKey,
      },
    ));
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
            {isDeleteSuccess ? "Deleted" : "Delete"}
          </LoadingButton>
        ) : <span />}
    </div>
  );
};

export default DeleteButton;
