import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  count: 0,
  num_pages: 0,
  next: null,
  previous: null,
  results: [],
};

const vatGroupSlice = createSlice({
  name: "vatGroup",
  initialState: initialState,
  reducers: {
    getVatGroups(state, action) {
      return action.payload;
    }
  },
});

export const {
  getVatGroups
} = vatGroupSlice.actions;

export const itemsSelector = (state) => state.vatGroups;

export default vatGroupSlice.reducer;

export const fetchVatGroups = (
  archived = false
  ) => async (dispatch) => {
  await axios
      .get(`/vatgroup?&archived__is=${archived}`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${process.env.REACT_APP_TOKEN}`
        },
        withCredentials: false,
    })
    .then((res) => {

        let vatGroups;

        if (!archived)
          vatGroups = res.data.results.filter(x => x.archived === false)
        else if (archived)
          vatGroups = res.data.results.filter(x => x.archived === true)

      dispatch(getVatGroups({
        count: vatGroups.length,
        num_pages: res.data.num_pages,
        next: res.data.next,
        previous: res.data.previous,
        results: vatGroups
      }));
    })
    .catch((error) => {});
};

export const fetchAllVatGroups = () => async (dispatch) => {
  await axios
      .get(`/vatgroup`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${process.env.REACT_APP_TOKEN}`
        },
        withCredentials: false,
    })
    .then((res) => {
      dispatch(getVatGroups({
        count: res.data.results.length,
        num_pages: res.data.num_pages,
        next: res.data.next,
        previous: res.data.previous,
        results: res.data.results
      }));
    })
    .catch((error) => {});
};