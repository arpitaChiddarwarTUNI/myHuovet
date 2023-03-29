import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  appointmenttypes: [],
};

const appointmenttypesSlice = createSlice({
  name: "appointmenttypes",
  initialState: initialState,
  reducers: {
    getAppointmenttypes(state, action) {
      return action.payload;
    },
  },
});

export const { getAppointmenttypes } = appointmenttypesSlice.actions;

export const appointmenttypesSelector = (state) => state.appointmenttypes;

export default appointmenttypesSlice.reducer;

export const fetchAppointmenttypes = () => async (dispatch) => {
  await axios
    .get(`${process.env.REACT_APP_APPOINTMENT_TYPE_URL}/appointmentType/getAllAppointmentType`, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      dispatch(getAppointmenttypes({appointmenttypes: res.data}));
    })
    .catch((error) => {});
};

export const postAppointmenttypes = (newAppointmentType) => async (dispatch) => {
  await axios
    .post(`${process.env.REACT_APP_APPOINTMENT_TYPE_URL}/appointmentType/addAppointmentType`, newAppointmentType, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      dispatch(fetchAppointmenttypes());
    })
    .catch((error) => {});
};


export const modifyAppointmenttype = (type) => async (dispatch) => {
  await axios
    .put(`${process.env.REACT_APP_APPOINTMENT_TYPE_URL}/appointmentType/modifyAppointmentType`, 
      type, 
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((res) => {
      dispatch(fetchAppointmenttypes());
    })
    .catch((error) => {});
};

export const deleteAppointmenttype = (id) => async (dispatch) => {
  await axios
    .delete(
      `${process.env.REACT_APP_APPOINTMENT_TYPE_URL}/appointmentType/deleteAppointmentType/${id}`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((res) => {
      dispatch(fetchAppointmenttypes());
    })
    .catch((error) => {});
}