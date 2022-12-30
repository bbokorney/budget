import {
  Typography, Stack, CircularProgress, Button, Divider,
} from "@mui/material";
import { Cached as CachedIcon } from "@mui/icons-material";
import { useListTransactionsQuery } from "../../lib/budget/budgetAPI";

const TransactionsList = () => {
  const { data, isFetching: isLoading, refetch } = useListTransactionsQuery(undefined);
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
          <Stack key={t.id} direction="column" spacing={0.75}>
            <Stack direction="row" spacing={1}>
              <Typography>{formatDate(t.date)}</Typography>
              <Typography sx={{ fontWeight: "bold" }}>{`$${t.amount?.toFixed(2)}`}</Typography>
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

function formatDate(time?: number) {
  if (!time) {
    return "";
  }
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric", month: "short", day: "numeric",
  };
  return (new Date(time)).toLocaleString("en-US", options);
}
