import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "./store";
import { HYDRATE } from "next-redux-wrapper";

// Type for our state
export interface UserState {
  isAdmin: boolean;
  userData?: any;
}

// Initial state
const initialState: UserState = {
  isAdmin: false,
  userData: null,
};

// Actual Slice
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData(state, action) {
      state.userData = action.payload;
    },
    setIsAdmin(state, action) {
      state.isAdmin = action.payload;
    },
  },

  // Special reducer for hydrating the state. Special case for next-redux-wrapper
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.user,
      };
    },
  },
});

export const { setUserData, setIsAdmin } = userSlice.actions;

export const selectUserData = (state: AppState) => state.user.userData;
export const selectIsAdmin = (state: AppState) => state.user.isAdmin;

export default userSlice.reducer;
