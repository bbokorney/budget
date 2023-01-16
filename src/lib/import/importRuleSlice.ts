import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store/store";
import { ImportAutoActionRule } from "../budget/models";

export interface ImportRuleFormState {
  rule: ImportAutoActionRule,
}

const initialState: ImportRuleFormState = {
  rule: {},
};

export const importRuleFormSlice = createSlice({
  name: "importRuleForm",
  initialState,
  reducers: {
    updateImportRuleFormState: (_, action: PayloadAction<ImportRuleFormState>) => action.payload,
    clearImportRuleFormState: () => initialState,
  },
});

export const { updateImportRuleFormState, clearImportRuleFormState } = importRuleFormSlice.actions;

export const selectImportRuleForm = (state: RootState) => state.importRuleForm;

export default importRuleFormSlice.reducer;
