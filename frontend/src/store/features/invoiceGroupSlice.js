import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  count: 0,
  num_pages: 0,
  next: null,
  previous: null,
  results: [],
};

const invoiceGroupSlice = createSlice({
  name: "invoiceGroup",
  initialState: initialState,
  reducers: {
    getInvoiceGroups(state, action) {
      return action.payload;
    }
  },
});

export const {
  getInvoiceGroups
} = invoiceGroupSlice.actions;

export const invoiceGroupSelector = (state) => state.invoiceGroups;

export default invoiceGroupSlice.reducer;

export const fetchInvoiceGroups = (
  archived = false
  ) => async (dispatch) => {
  await axios
      .get(`/invoicegroup`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${process.env.REACT_APP_TOKEN}`
        },
        withCredentials: false,
    })
    .then((res) => {
      dispatch(getInvoiceGroups({
        count: res.data.count,
        num_pages: res.data.num_pages,
        next: res.data.next,
        previous: res.data.previous,
        results: res.data.results
      }));
    })
    .catch((error) => {});
};