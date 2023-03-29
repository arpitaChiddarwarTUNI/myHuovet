import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {setLoader} from "./loadingSlice";
import moment from "moment";

const initialState = {
  count: 0,
  num_pages: 0,
  next: null,
  previous: null,
  results: [],
};

const stockBatchSlice = createSlice({
  name: "stockBatches",
  initialState: initialState,
  reducers: {
    getStockBatches(state, action) {
      return action.payload;
    }
  },
});

export const {
  getStockBatches: getStockBatches
} = stockBatchSlice.actions;

export const stockBatchesSelector = (state) => state.stockBatches;

export default stockBatchSlice.reducer;

export const fetchStockBatches = (
  page = 1,
  page_size = 20,
  ordering = 'description',
  include_archived = false
  ) => async (dispatch) => {
  dispatch(setLoader(true));

  if(page == 0)
    page = 1;

  let url = `/stock/batch?&page=${page}&page_size=${page_size}&ordering=${ordering}&expose_stock_item&include_archived=${include_archived}`;

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
      dispatch(getStockBatches({
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

export const searchStockBatches = (
  page_size = 20,
  ordering = 'description',
  include_archived = false,
  batch_number = ''
  ) => async (dispatch) => {
  dispatch(setLoader(true));

    let url = `/stock/batch?page_size=${page_size}&ordering=${ordering}&expose_stock_item&include_archived=${include_archived}`;

    if(batch_number && batch_number != '')
      url += `&batch_number__icontains=${batch_number}`;

    await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${process.env.REACT_APP_TOKEN}`
      },
        withCredentials: false,
    })
    .then((res) => {
      dispatch(setLoader(false));
      dispatch(getStockBatches({
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

export const saveStockBatch = (batch, showToast) => async (dispatch) => {
  if(batch.expiry_date)
    batch.expiry_date = moment(batch.expiry_date).format('YYYY-MM-DD');

  if (!batch.id || batch.id == 0)
  {
    await axios.post(`/stock/batch/`, batch, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${process.env.REACT_APP_TOKEN}`
        },
        withCredentials: false,
      }).then((res) => {
          showToast('success', 'Saved', 'Stock batch saved successfully!');
          dispatch(getStockBatches(res.data));
        })
        .catch((error) => {
          showToast('error', 'Error', error.response.data.non_field_errors.join(', '));
          console.log(error);
        });
  } else {
    await axios.patch(`/stock/batch/${batch.id}/`, batch, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${process.env.REACT_APP_TOKEN}`
        },
        withCredentials: false,
      }).then((res) => {
          showToast('success', 'Saved', 'Stock batch saved successfully!');
          dispatch(fetchStockBatches());
        })
        .catch((error) => {
          showToast('error', 'Error', error.response.data.non_field_errors.join(', '));
          console.log(error);
        });
  }
};

export const deleteStockBatch = (batchId, showToast) => async (dispatch) => {
  let http = '';

  if (!batchId || batchId == 0)
  {
    showToast('error', 'Error', 'Invalid batch id.');
    return;
  }

  axios
    .delete(`/stock/batch/${batchId}/`,{
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${process.env.REACT_APP_TOKEN}`
        },
        withCredentials: false,
      })
      .then((res) => {
        showToast('success', 'Deleted', 'Stock batch deleted successfully!');
        dispatch(fetchStockBatches());
      })
      .catch((error) => {
        showToast('error', 'Error', error.response.data.non_field_errors.join(', '));
        console.log(error);
      });
};