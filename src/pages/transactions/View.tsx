import { useState } from "react";
import {
  Button, Stack, Typography, CircularProgress, Divider,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../lib/store/hooks";
import { useGetTransactionQuery } from "../../lib/budget/budgetAPI";
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
  const { data, isLoading } = useGetTransactionQuery(id);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const handleDialogClose = () => {
    setOpenDeleteDialog(false);
  };
  const handleDelete = async () => {
    handleDialogClose();
  };

  const onClickEdit = () => {
    if (data) {
      dispatch(updateTransactionFormState({ transaction: data }));
      dispatch(updateFormDialogState({ open: true, actionType: "Update" }));
    }
  };

  return (
    <Stack direction="column" sx={{ mt: 1 }} spacing={1}>
      <Stack direction="row" sx={{ mt: 1 }} spacing={1} justifyContent="space-around">
        {isLoading && <CircularProgress color="secondary" />}
      </Stack>
      {data && (
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
              <Typography>{formatDate(data?.date)}</Typography>
              <Typography sx={{ fontWeight: "bold" }}>{formatCurrency(data?.amount ?? 0)}</Typography>
            </Stack>
            <Typography>Category: {data?.category}</Typography>
            <Typography>Vendor: {data?.vendor}</Typography>
            <Typography sx={{ whiteSpace: "pre-wrap" }} component="pre">Notes: {data?.notes}</Typography>
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
