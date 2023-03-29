import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  staff: [],
};

const staffSlice = createSlice({
  name: "staff",
  initialState: initialState,
  reducers: {
    getStaff(state, action) {
      return action.payload;
    },
  },
});

export const { getStaff } = staffSlice.actions;

export const staffSelector = (state) => state.staff;

export default staffSlice.reducer;

export const fetchStaff = () => async (dispatch) => {
  await axios
    .get(`${process.env.REACT_APP_STAFF_URL}/staff/getAllStaff`, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      //console.log(res.data);
      dispatch(getStaff({ staff: res.data }));
    })
    .catch((error) => {});
};

export const addStaff = (staffmember) => async (dispatch) => {
  await axios
    .post(
      `${process.env.REACT_APP_STAFF_URL}/staff/addStaff`,
      staffmember,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((res) => {
      //console.log(res.data);
      dispatch(fetchStaff());
    })
    .catch((error) => {});
};

export const modifyStaff = (staffmember) => async (dispatch) => {
  await axios
    .put(`${process.env.REACT_APP_STAFF_URL}/staff/modifyStaff`, 
      staffmember, 
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((res) => {
      dispatch(fetchStaff());
    })
    .catch((error) => {});
};

export const deleteStaff = (id) => async (dispatch) => {
  await axios
    .delete(
      `${process.env.REACT_APP_STAFF_URL}/staff/deleteStaff/${id}`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((res) => {
      dispatch(fetchStaff());
    })
    .catch((error) => {});
}