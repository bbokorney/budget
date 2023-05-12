import { Button, Typography, Stack } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { clearGoalFormState } from "../../lib/goals/goalFormSlice";
import { useAppDispatch } from "../../lib/store/hooks";

const SpendingGoals = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const onClickAdd = () => {
    dispatch(clearGoalFormState());
    navigate("/goals/add");
  };

  return (
    <Stack direction="row" sx={{ mt: 1 }} spacing={1} justifyContent="space-between">
      <Typography variant="h6">
        Spending Goals
      </Typography>
      <Button
        onClick={onClickAdd}
        variant="contained"
        color="secondary"
      ><Add />
      </Button>
    </Stack>
  );
};

export default SpendingGoals;
