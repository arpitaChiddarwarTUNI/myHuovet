import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  patients: [],
  loading: false,
  error: "",
};
const patientsSlice = createSlice({
  name: "patients",
  initialState: initialState,
  reducers: {
    getPatients(state, action) {
      return action.payload;
    },
    setLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
    setErrorMessage(state, action) {
      return {
        ...state,
        error: action.payload,
      };
    },
  },
});

export const { getPatients, setLoading, setErrorMessage } =
  patientsSlice.actions;

export const patientsSelector = (state) => state.patients;

export default patientsSlice.reducer;

export const fetchPatients = (customerId) => async (dispatch) => {
  await axios
    .get(
      `${process.env.REACT_APP_CUSTOMER_URL}/customer/${customerId}/patients`,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((res) => {
      dispatch(getPatients({ patients: res.data, loading: false, error: "" }));
    })
    .catch((error) => {
      console.log(error.response.data.message);
      dispatch(setErrorMessage(error.response.data.message));
      dispatch(getPatients({ patients: [], loading: false, error: "" }));
    });
};

export const createPatient = (patientObject) => async (dispatch) => {
  await axios
    .post(
      `${process.env.REACT_APP_PATIENT_URL}/patient/addPatient`,
      patientObject,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((res) => {
      dispatch(fetchPatients(patientObject.customerId));
    })
    .catch((error) => {
      dispatch(setErrorMessage(error.response.data.message));
    });
};

export const updatePatient = (patientObject) => async (dispatch) => {
  await axios
    .put(
      `${process.env.REACT_APP_PATIENT_URL}/patient/modifyPatient`,
      patientObject,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((res) => {
      dispatch(fetchPatients(patientObject.customerId));
    })
    .catch((error) => {});
};

export const deletePatient = (id, customerId) => async (dispatch) => {
  await axios
    .delete(
      `${process.env.REACT_APP_PATIENT_URL}/patient/deletePatient/${id}`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((res) => {
      dispatch(fetchPatients(customerId))     
    })
    .catch((error) => {
      dispatch(setErrorMessage(error.response.data.message));
    });
}
