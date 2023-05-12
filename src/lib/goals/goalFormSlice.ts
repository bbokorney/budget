import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store/store";
import { Goal } from "../budget/models";

export interface GoalFormState {
  goal: Goal,
}

const initialState: GoalFormState = {
  goal: {},
};

export const goalFormSlice = createSlice({
  name: "goalForm",
  initialState,
  reducers: {
    updateGoalFormState: (_, action: PayloadAction<GoalFormState>) => action.payload,
    clearGoalFormState: () => initialState,
  },
});

export const { updateGoalFormState, clearGoalFormState } = goalFormSlice.actions;

export const selectGoalForm = (state: RootState) => state.goalForm;

export default goalFormSlice.reducer;
