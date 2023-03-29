import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  loading: false,
};

const loadingSlice = createSlice({
  name: "loading",
  initialState: initialState,
  reducers: {
    setLoading(state, action) {
      return action.payload;
    }
  },
});

export const {
  setLoading
} = loadingSlice.actions;

export const loadingSelector = (state) => state.loading;

export default loadingSlice.reducer;

export const setLoader = (value) => async (dispatch) => {
  dispatch(setLoading({ loading: value }));
};
