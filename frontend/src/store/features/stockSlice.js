import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {setLoader} from "./loadingSlice";

const initialState = {
  count: 0,
  num_pages: 0,
  next: null,
  previous: null,
  results: [],
};

const stockSlice = createSlice({
  name: "stocks",
  initialState: initialState,
  reducers: {
    getStocks(state, action) {
      return action.payload;
    }
  },
});

export const {
  getStocks
} = stockSlice.actions;

export const stocksSelector = (state) => state.stocks;

export default stockSlice.reducer;

export const fetchStocks = (
  page = 1,
  page_size = 20,
  ordering = 'description',
  include_archived = false,
  type = 0
  ) => async (dispatch) => {
  dispatch(setLoader(true));

  if(page == 0)
    page = 1;

  let url = `/stock/entry?&page=${page}&page_size=${page_size}&ordering=${ordering}&include_archived=${include_archived}`;

  if(type != 0)
    url += `&type__eq=${type}`;

  await axios
      .get(url, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${process.env.REACT_APP_TOKEN}`
        },
        withCredentials: false,
    })
    .then((res) => {
      dispatch(setLoader(false));
      dispatch(getStocks({
        count: res.data.count,
        num_pages: res.data.num_pages,
        next: res.data.next,
        previous: res.data.previous,
        results: res.data.results
      }));
    })
    .catch((error) => {
      dispatch(setLoader(false));
    });
};

export const searchStocks = (
  page_size = 20,
  ordering = 'description',
  include_archived = false,
  searchValue = '',
  type = 0
  ) => async (dispatch) => {
  dispatch(setLoader(true));

    let url = `/stock/entry?page_size=${page_size}&ordering=${ordering}&include_archived=${include_archived}`;

    if(type && type != 0)
      url += `&type__eq=${type}`;

    if(searchValue)
      url += `&description__icontains=${searchValue}`;

    await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${process.env.REACT_APP_TOKEN}`
      },
        withCredentials: false,
    })
    .then((res) => {
      dispatch(setLoader(false));
      dispatch(getStocks({
        count: res.data.count,
        num_pages: res.data.num_pages,
        next: res.data.next,
        previous: res.data.previous,
        results: res.data.results
      }));
    })
    .catch((error) => {
      dispatch(setLoader(false));
    });
};

