import { useState, useEffect } from "react";
import {
  Button, Stack, Typography, CircularProgress, Divider, Backdrop,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
} from "@mui/material";
import { Delete, Edit, Check } from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../lib/store/hooks";
import { useGetTransactionQuery, useDeleteTransactionMutation } from "../../lib/budget/budgetAPI";
import formatDate from "../../lib/dates/format";
import { formatCurrency } from "../../lib/currency/format";
import { updateFormDialogState } from "../../lib/formDialog/formDialogSlice";
import { updateTransactionFormState } from "../../lib/form/transactionFormSlice";

const ViewTransaction = () => {
  const { id } = useParams();
  if (!id) {
    return <div>Transaction not found</div>;
  }

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { data, isLoading } = useGetTransactionQuery(id);
  let transaction = data;
  const [
    deleteTransaction,
    {
      isLoading: isDeleting, isSuccess: isDeleteSuccess, reset, data: deletedData,
    },
  ] = useDeleteTransactionMutation();
  if (isDeleteSuccess) {
    transaction = deletedData;
  }

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const handleDialogClose = () => {
    setOpenDeleteDialog(false);
  };
  const handleDelete = async () => {
    handleDialogClose();
    deleteTransaction(data ?? {});
  };

  useEffect(() => {
    if (isDeleteSuccess) {
      setTimeout(() => {
        navigate("/transactions/list");
        reset();
      }, 1000);
    }
  }, [isDeleteSuccess]);

  const onClickEdit = () => {
    if (transaction) {
      dispatch(updateTransactionFormState({ transaction }));
      dispatch(updateFormDialogState({ open: true, actionType: "Update" }));
    }
  };

  const backdropOpen = isLoading || isDeleting || isDeleteSuccess;
  let message = "";
  if (isDeleteSuccess) {
    message = "Transaction deleted";
  }
  if (isDeleting) {
    message = "Deleting...";
  }

  return (
    <Stack direction="column" sx={{ mt: 1 }} spacing={1}>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={backdropOpen}
      >
        <Stack spacing={2} alignItems="center">
          {isDeleteSuccess ? <Check color="secondary" /> : <CircularProgress color="secondary" /> }
          <Typography>{message}</Typography>
        </Stack>
      </Backdrop>
      {transaction && (
        <>
          <Stack direction="row" sx={{ mt: 1 }} spacing={1}>
            <Typography variant="h6">
              Transaction
            </Typography>
            <Stack direction="row" sx={{ width: "100%" }} spacing={1} justifyContent="flex-end">
              <Button variant="contained" onClick={() => setOpenDeleteDialog(true)}><Delete /></Button>
              <Button variant="contained" onClick={onClickEdit}><Edit /></Button>
            </Stack>
          </Stack>
          <Stack>
            <Stack direction="row" spacing={1} divider={<Divider orientation="vertical" flexItem />}>
              <Typography>{formatDate(transaction?.date)}</Typography>
              <Typography sx={{ fontWeight: "bold" }}>{formatCurrency(transaction?.amount ?? 0)}</Typography>
            </Stack>
            <Typography>Category: {transaction?.category}</Typography>
            <Typography>Vendor: {transaction?.vendor}</Typography>
            <Typography
              sx={{ whiteSpace: "pre-wrap" }}
              component="pre"
            >Notes: {transaction?.notes}
            </Typography>
          </Stack>

          <Dialog
            open={openDeleteDialog}
            onClose={handleDialogClose}
          >
            <DialogTitle>
              Delete transaction
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to delete this transaction?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDialogClose}>Cancel</Button>
              <Button color="secondary" variant="contained" onClick={handleDelete} autoFocus>
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Stack>
  );
};

export default ViewTransaction;
