import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store/store";

export interface FormDialogState {
  open: boolean;
  actionType: "Add" | "Update";
}

const initialState: FormDialogState = {
  open: false,
  actionType: "Add",
};

export const formDialogSlice = createSlice({
  name: "formDialog",
  initialState,
  reducers: {
    updateFormDialogState: (_, action: PayloadAction<FormDialogState>) => action.payload,
    clearFormDialogState: () => initialState,
  },
});

export const { updateFormDialogState, clearFormDialogState } = formDialogSlice.actions;

export const selectFormDialog = (state: RootState) => state.formDialog;

export default formDialogSlice.reducer;
