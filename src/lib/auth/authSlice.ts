import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store/store";
import { User } from "./user";

export interface AuthState {
  user: User | null
  status: "initialized" | "loading";
  error: string;
}

const initialState: AuthState = {
  user: null,
  status: "loading",
  error: "",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.status = "initialized";
    },
    updateError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
});

export const { updateUser, updateError } = authSlice.actions;

export const selectAuth = (state: RootState) => state.auth;

export default authSlice.reducer;
