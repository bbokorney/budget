import {
  Typography, Stack, CircularProgress, Button, Divider,
} from "@mui/material";
import { Cached as CachedIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useListTransactionsQuery } from "../../lib/budget/budgetAPI";
import { formatCurrency } from "../../lib/currency/format";
import formatDate from "../../lib/dates/format";

const TransactionsList = () => {
  const { data, isFetching: isLoading, refetch } = useListTransactionsQuery(undefined);
  const navigate = useNavigate();
  return (
    <>
      <Stack direction="row" sx={{ mt: 1 }} spacing={1} justifyContent="space-between">
        <Typography variant="h6">
          Transactions
        </Typography>
        <Button
          onClick={() => refetch()}
          variant="contained"
          color="secondary"
        ><CachedIcon />
        </Button>
      </Stack>

      <Stack direction="column" sx={{ mt: 1, mb: 2 }} spacing={2} divider={<Divider />}>
        {data && data.map((t) => (
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
    </>
  );
};
export default TransactionsList;
