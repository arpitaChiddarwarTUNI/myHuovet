import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  count: 0,
  num_pages: 0,
  next: null,
  previous: null,
  results: [],
};

const itemListSlice = createSlice({
  name: "itemList",
  initialState: initialState,
  reducers: {
    getItemLists(state, action) {
      return action.payload;
    }
  },
});

export const {
  getItemLists
} = itemListSlice.actions;

export const itemListSelector = (state) => state.itemLists;

export default itemListSlice.reducer;

export const fetchItemLists = (
  archived = false
  ) => async (dispatch) => {
  await axios
      .get(`/itemlist`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${process.env.REACT_APP_TOKEN}`
        },
        withCredentials: false,
    })
    .then((res) => {
      dispatch(getItemLists({
        count: res.data.count,
        num_pages: res.data.num_pages,
        next: res.data.next,
        previous: res.data.previous,
        results: res.data.results
      }));
    })
    .catch((error) => {});
};