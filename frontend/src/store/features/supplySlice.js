import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  count: 0,
  num_pages: 0,
  next: null,
  previous: null,
  supplies: [],
};

const supplySlice = createSlice({
  name: "supplies",
  initialState: initialState,
  reducers: {
    getSupplies(state, action) {
      return action.payload;
    },
  },
});

export const { getSupplies } = supplySlice.actions;

export const supplySelector = (state) => state.treatments;

export default supplySlice.reducer;

export const fetchSupplies = (page = 1, page_size = 1000, ordering = 'id', include_archived = false, searchValue = '', filter = 'name') => async (dispatch) => {
  
  let url = filter === 'name'
    ? `/supply?page=${page}&page_size=${page_size}&ordering=${ordering}&include_archived=${include_archived}&name__icontains=${searchValue}`
    : `/supply?page=${page}&page_size=${page_size}&ordering=${ordering}&include_archived=${include_archived}&code__icontains=${searchValue}`;
  
  await axios
    .get(url, {
      withCredentials: false,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${process.env.REACT_APP_TOKEN}`
      },
    })
    .then((res) => {
      dispatch(getSupplies({ 
        count: res.data.count,
        num_pages: res.data.num_pages,
        next: res.data.next,
        previous: res.data.previous,
        results: res.data.results 
      }));
    })
    .catch((error) => {});
};

export const addSupply = (supply) => async (dispatch) => {
  await axios
    .post(`/supply/`,
      JSON.stringify(supply),
      {
        withCredentials: false,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${process.env.REACT_APP_TOKEN}`
        }
      }
    )
    .then((res) => {
      
    })
    .catch((error) => {});
};

export const modifySupply = (supply, id) => async (dispatch) => {
  await axios
    .put(`/supply/${id}/`, 
      JSON.stringify(supply),
      {
        withCredentials: false,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${process.env.REACT_APP_TOKEN}`
        }
      }
    )
    .then((res) => {
      
    })
    .catch((error) => {});
};

export const deleteSupply = (id) => async (dispatch) => {
  await axios
    .delete(`/supply/${id}/`, 
    {
      withCredentials: false,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${process.env.REACT_APP_TOKEN}`
      }
    }
  )
  .then((res) => {
    
  })
    .catch((error) => {});
}