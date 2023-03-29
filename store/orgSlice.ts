import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "./store";
import { HYDRATE } from "next-redux-wrapper";

// Type for our state
export interface OrgState {
  orgState: number;
  orgName: string;
}

// Initial state
const initialState: OrgState = {
  orgState: 0,
  orgName: "",
};

// Actual Slice
export const orgSlice = createSlice({
  name: "org",
  initialState,
  reducers: {
    // Action to set the authentication status
    setOrgState(state, action) {
      state.orgState = action.payload;
    },
    setOrgName(state, action) {
      state.orgName = action.payload;
    },
  },

  // Special reducer for hydrating the state. Special case for next-redux-wrapper
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.org,
      };
    },
  },
});

export const { setOrgState, setOrgName } = orgSlice.actions;

export const selectOrgState = (state: AppState) => state.org.orgState;
export const selectOrgName = (state: AppState) => state.org.orgName;

export default orgSlice.reducer;
