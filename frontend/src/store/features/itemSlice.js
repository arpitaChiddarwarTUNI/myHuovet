import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setLoader } from "./loadingSlice";
import moment from "moment";

const initialState = {
  count: 0,
  num_pages: 0,
  next: null,
  previous: null,
  results: [],
};

const itemSlice = createSlice({
  name: "items",
  initialState: initialState,
  reducers: {
    getItems(state, action) {
      return action.payload;
    }
  },
});

export const {
  getItems
} = itemSlice.actions;

export const itemsSelector = (state) => state.items;

export default itemSlice.reducer;

export const fetchItems = (
) => async (dispatch) => {
  dispatch(setLoader(true));

  let url = `/item?page_size=1000&include_archived=false`;

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
        dispatch(getItems({
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

export const fetchItemsWithParams = (
  page = 1,
  page_size = 20,
  ordering = 'id',
  include_archived = false,
  type_code = '',
  department = '',
  only_cabinet_items = false
  ) => async (dispatch) => {
    dispatch(setLoader(true));

  if (page == 0)
    page = 1;

  let url = `/item?&page=${page}&page_size=${page_size}&ordering=${ordering}&include_archived=${include_archived}`;

  if (type_code && type_code != 0)
    url += `&type_code__eq=${type_code}`;

  if (department && department != '')
    url += `&department__eq=${department}`;

  if (only_cabinet_items && only_cabinet_items != '')
    url += `&only_cabinet_items=${only_cabinet_items}`;

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
      dispatch(getItems({
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

export const searchItems = (
  page = 1,
  page_size = 20,
  ordering = 'id',
  include_archived = false,
  searchValue = '',
  type_code = '',
  department = '',
  only_cabinet_items = false
  ) => async (dispatch) => {
    dispatch(setLoader(true));

    if(page == 0)
      page = 1;

    let url;

    if (searchValue)
      url = `/item?page=${page}&page_size=${page_size}&ordering=${ordering}&include_archived=${include_archived}&name__icontains=${searchValue}`
    else
      url = `/item?page=${page}&page_size=${page_size}&ordering=${ordering}&include_archived=${include_archived}`;

    if (type_code && type_code != 0)
      url += `&type_code__eq=${type_code}`;

    if(department && department != '')
      url += `&department__eq=${department}`;

    if(only_cabinet_items && only_cabinet_items != '')
      url += `&only_cabinet_items=${only_cabinet_items}`;

    await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${process.env.REACT_APP_TOKEN}`
      },
        withCredentials: false,
    })
    .then((res) => {
      dispatch(setLoader(false));
      dispatch(getItems({
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

export const saveItem = (item, showToast) => async (dispatch) => {
  if(item.archived_date)
    item.archived_date = moment(item.archived_date).format('YYYY-MM-DD');
  await axios
    .put(`/item/${item.id}/`, item, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${process.env.REACT_APP_TOKEN}`
        },
        withCredentials: false,
      })
    .then((res) => {
      showToast('success', 'Saved', 'Item saved successfully!');
      dispatch(getItems(res.data));
    })
    .catch((error) => {
      showToast('error', 'Error', error.response.data.non_field_errors.join(', '));
      console.log(error);
    });
};

export const addToStock = (item, showToast) => async (dispatch) => {
  item.department_id = 1;
  if(item.expiry_date)
    item.expiry_date = moment(item.expiry_date).format('YYYY-MM-DD');
  await axios
    .post(`/item/${item.id}/add_batch_to_stock/`, item, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${process.env.REACT_APP_TOKEN}`
        },
        withCredentials: false,
      })
    .then((res) => {
      showToast('success', 'Saved', res.data.status);
      dispatch(getItems(res.data));
    })
    .catch((error) => {
      showToast('error', 'Error', error.response.data.non_field_errors.join(', '));
    });
};