import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  diagnosetypes: [],
};

const diagnosetypesSlice = createSlice({
  name: "diagnosetypes",
  initialState: initialState,
  reducers: {
    getDiagnosetypes(state, action) {
      return action.payload;
    },
  },
});

export const { getDiagnosetypes } = diagnosetypesSlice.actions;

export const diagnosetypesSelector = (state) => state.diagnosetypes;

export default diagnosetypesSlice.reducer;

export const fetchDiagnosetypes = () => async (dispatch) => {
  await axios
    .get(`${process.env.REACT_APP_DIAGNOSETYPES_URL}/diagnosis/getAllDiagnosis`, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      dispatch(getDiagnosetypes({diagnosetypes: res.data}));
    })
    .catch((error) => {});
};

export const postDiagnosetypes = (diagnosetype) => async (dispatch) => {
  await axios
    .post(`${process.env.REACT_APP_DIAGNOSETYPES_URL}/diagnosis/addDiagnosis`, diagnosetype, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      dispatch(fetchDiagnosetypes());
    })
    .catch((error) => {});
};

export const modifyDiagnosetype = (diagnosetype) => async (dispatch) => {
  await axios
    .put(`${process.env.REACT_APP_DIAGNOSETYPES_URL}/diagnosis/modifyDiagnosis`, 
      diagnosetype, 
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((res) => {
      dispatch(fetchDiagnosetypes());
    })
    .catch((error) => {});
};

export const deleteDiagnosetype = (id) => async (dispatch) => {
  await axios
    .delete(
      `${process.env.REACT_APP_DIAGNOSETYPES_URL}/diagnosis/deleteDiagnosis/${id}`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((res) => {
      dispatch(fetchDiagnosetypes());
    })
    .catch((error) => {});
}