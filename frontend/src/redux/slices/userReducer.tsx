import { createSlice } from "@reduxjs/toolkit";
import { IUser } from "../../types";

const initialState: {
  user: IUser;
  token: string;
  isLoggedIn: boolean;
} = {
  user: {
    id: "",
    firstName: "",
    lastName: "",
    createdAt: new Date(),
    updatedAt: new Date(),
    email: "",
    role: "USER",
  },
  token: "",
  isLoggedIn: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, { payload }) => {
      state.isLoggedIn = true;
      state.user = { ...payload.user };
      state.token = payload.token;
    },

    logout: (state) => {
      state.isLoggedIn = false;
      state.user = {
        ...initialState.user,
      };
      state.token = "";
      window.location.replace("/auth/login");
    },
  },
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;
