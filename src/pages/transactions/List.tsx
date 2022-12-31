import React, { useEffect } from "react";
import {
  Typography, Stack, CircularProgress, Button, Divider,
} from "@mui/material";
import { Cached as CachedIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../lib/store/hooks";
import {
  useListTransactionsQuery,
} from "../../lib/budget/budgetAPI";
import { formatCurrency } from "../../lib/currency/format";
import formatDate from "../../lib/dates/format";
import {
  selectListTransactionsPagination,
  updateListTransactionsPaginationState,
} from "../../lib/budget/paginationSlice";

const TransactionsList = () => {
  const dispatch = useAppDispatch();
  const { lastTransaction } = useAppSelector(selectListTransactionsPagination);
  const {
    data: transactions, isFetching: isLoading, refetch: refetchTransactions,
  } = useListTransactionsQuery(lastTransaction);

  const navigate = useNavigate();

  const bottomRef = React.createRef<Element>();

  useEffect(() => {
    if (!bottomRef.current) {
      return () => {};
    }

    const ref = bottomRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && transactions && !isLoading) {
            dispatch(
              updateListTransactionsPaginationState(
                { lastTransaction: transactions[transactions.length - 1] },
              ),
            );
          }
        });
      },
    );

    observer.observe(ref);

    return () => {
      observer.unobserve(ref);
    };
  }, [transactions]);

  return (
    <>
      <Stack direction="row" sx={{ mt: 1 }} spacing={1} justifyContent="space-between">
        <Typography variant="h6">
          Transactions
        </Typography>
        <Button
          onClick={() => {
            refetchTransactions();
          }}
          variant="contained"
          color="secondary"
        ><CachedIcon />
        </Button>
      </Stack>

      <Stack direction="column" sx={{ mt: 1, mb: 2 }} spacing={2} divider={<Divider />}>
        {transactions && transactions.map((t) => (
          <Stack
            key={t.id}
            direction="column"
            spacing={0.75}
            onClick={() => navigate(`/transactions/${t.id}`)}
          >
            <Stack direction="row" spacing={1}>
              <Typography>{formatDate(t.date)}</Typography>
              <Typography sx={{ fontWeight: "bold" }}>{formatCurrency(t.amount ?? 0)}</Typography>
            </Stack>
            <Stack direction="row" spacing={1} divider={<Divider orientation="vertical" flexItem />}>
              <Typography>{t.category}</Typography>
              <Typography>{t.vendor}</Typography>
            </Stack>
          </Stack>
        ))}
      </Stack>

      <Stack direction="row" sx={{ mt: 1 }} spacing={1} justifyContent="space-around">
        {isLoading && <CircularProgress color="secondary" />}
      </Stack>

      <Stack ref={bottomRef} />
    </>
  );
};
export default TransactionsList;
