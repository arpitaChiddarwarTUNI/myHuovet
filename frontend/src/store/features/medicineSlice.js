import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setLoader } from "./loadingSlice";

const initialState = {
  count: 0,
  num_pages: 0,
  next: null,
  previous: null,
  results: [],
};

const medicineSlice = createSlice({
  name: "medicines",
  initialState: initialState,
  reducers: {
    getMedicines(state, action) {
      return action.payload;
    }
  },
});

export const {
  getMedicines
} = medicineSlice.actions;

export const medicinesSelector = (state) => state.medicines;

export default medicineSlice.reducer;

export const fetchMedicines = (
  page = 1,
  page_size = 1000,
  ordering = 'id',
  include_archived = false,
  searchValue = '', filter = 'name'
  ) => async (dispatch) => {
    
    dispatch(setLoader(true))

    if (page == 0)
    page = 1;

  let url = `/medicine?&page=${page}&page_size=${page_size}&ordering=${ordering}&include_archived=${include_archived}`;
  
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
      dispatch(getMedicines({
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

export const searchMedicines = (
  page = '',
  page_size = 1000,
  ordering = 'id',
  include_archived = false,
  searchValue = '',
  filter = 'name'
  ) => async (dispatch) => {
    if (page == 0)
    page = 1;

    let url;
    
    if (searchValue)
      url = filter === 'name'
        ? `/medicine?page=${page}&page_size=${page_size}&ordering=${ordering}&include_archived=${include_archived}&name__icontains=${searchValue}`
        : `/medicine?page=${page}&page_size=${page_size}&ordering=${ordering}&include_archived=${include_archived}&code__icontains=${searchValue}`;
    else
      url = `/medicine?page=${page}&page_size=${page_size}&ordering=${ordering}&include_archived=${include_archived}`;

    await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${process.env.REACT_APP_TOKEN}`
      },
        withCredentials: false,
    })
    .then((res) => {
      dispatch(setLoader(false));
      dispatch(getMedicines({
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

export const addMedicine = (medicine) => async (dispatch) => {
  await axios.post(`/medicine/?page=2`, medicine, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${process.env.REACT_APP_TOKEN}`
      },
      withCredentials: false,
    })
    .then((res) => {
    dispatch(getMedicines(res.data));
      
    })
    .catch((error) => {});
};

export const modifyMedicine = (medicineId,medicine) => async (dispatch) => {
  await axios
    .put(`/medicine/${medicineId}/`, medicine, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${process.env.REACT_APP_TOKEN}`
      },
      withCredentials: false,
    })
    .then((res) => {

    })
    .catch((error) => {
      console.log(error);
    });
};

export const deleteMedicine = (id) => async (dispatch) => {
  await axios
    .delete(`/medicine/${id}/`, 
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
