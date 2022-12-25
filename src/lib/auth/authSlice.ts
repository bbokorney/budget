import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store/store";
import { User } from "./user";

export interface AuthState {
  user: User | null
  status: "initialized" | "loading";
}

const initialState: AuthState = {
  user: null,
  status: "loading",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.status = "initialized";
    },
  },
});

export const { updateUser } = authSlice.actions;

export const selectAuth = (state: RootState) => state.auth;

export default authSlice.reducer;
