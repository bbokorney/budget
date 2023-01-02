import React, { useState } from "react";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import {
  Typography, TextField, Stack, CircularProgress, Divider,
} from "@mui/material";
import { useGetTotalsByCategoryInDateRangeQuery } from "../../lib/budget/budgetAPI";
import { formatCurrency } from "../../lib/currency/format";

const Home = () => {
  const now = new Date();
  const [startDate, setStartDate] = useState(new Date(now.getFullYear(), now.getMonth(), 1));
  const [endDate, setEndDate] = useState(new Date(now.getFullYear(), now.getMonth() + 1, 0));
  const { data, isLoading } = useGetTotalsByCategoryInDateRangeQuery(
    { startDate: startDate.getTime(), endDate: endDate.getTime() },
  );
  const totals = data?.categories.map((c) => c).sort((a, b) => b.amount - a.amount) ?? [];
  return (
    <Stack spacing={2}>
      <Typography variant="h6">
        Spending
      </Typography>

      <Stack direction="row" spacing={1} justifyContent="space-around">
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <MobileDatePicker
            label="Start"
            inputFormat="MM/dd/yyyy"
            value={startDate}
            onChange={(date) => date && setStartDate(date)}
        // eslint-disable-next-line react/jsx-props-no-spreading
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <MobileDatePicker
            label="End"
            inputFormat="MM/dd/yyyy"
            value={endDate}
            onChange={(date) => date && setEndDate(date)}
        // eslint-disable-next-line react/jsx-props-no-spreading
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
      </Stack>

      <Stack direction="row" sx={{ mt: 1 }} spacing={1} justifyContent="space-around">
        {isLoading && <CircularProgress color="secondary" />}
      </Stack>

      <Stack direction="column" sx={{ mt: 1, mb: 2 }} spacing={2}>
        {data && (
          <>
            <CategoryTotalRow
              category="Total"
              amount={data.total}
            />
            <Divider />
          </>
        )}
        {totals.map((c) => (
          <CategoryTotalRow
            key={c.category}
            category={c.category}
            amount={c.amount}
            percentage={c.percentage}
          />
        ))}
      </Stack>
    </Stack>
  );
};
export default Home;

interface CategoryTotalRowProps {
  category: string;
  amount: number;
  percentage?: number;
}

const CategoryTotalRow: React.FC<CategoryTotalRowProps> = ({
  category, amount, percentage,
}) => (
  <Stack direction="row" spacing={1}>
    <Typography sx={{ flexGrow: "1", alignSelf: "left" }}>{category}</Typography>
    <Stack direction="row" spacing={1} sx={{ justifyContent: "right" }}>
      <Typography sx={{ fontWeight: "bold" }}>{formatCurrency(amount)}</Typography>
      {percentage && <Typography>({percentage.toFixed(0)}%)</Typography>}
    </Stack>
  </Stack>

);
