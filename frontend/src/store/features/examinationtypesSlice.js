import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  examinationtypes: [],
};

const examinationtypesSlice = createSlice({
  name: "examinationtypes",
  initialState: initialState,
  reducers: {
    getExaminationtypes(state, action) {
      return action.payload;
    },
  },
});

export const { getExaminationtypes } = examinationtypesSlice.actions;

export const examinationtypesSelector = (state) => state.examinationtypes;

export default examinationtypesSlice.reducer;

export const fetchExaminationtypes = () => async (dispatch) => {
  await axios
    .get(`${process.env.REACT_APP_EXAMINATIONTYPES_URL}/examinationtype/getAllExaminationtype`, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      dispatch(getExaminationtypes({examinationtypes: res.data}));
    })
    .catch((error) => {});
};

export const postExaminationtypes = (examtype) => async (dispatch) => {
  await axios
    .post(`${process.env.REACT_APP_EXAMINATIONTYPES_URL}/examinationtype/addExaminationtype`, examtype, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      //console.log(res.data);
      dispatch(fetchExaminationtypes());
    })
    .catch((error) => {});
};

export const modifyExaminationtype = (examtype) => async (dispatch) => {
  await axios
    .put(`${process.env.REACT_APP_EXAMINATIONTYPES_URL}/examinationtype/modifyExaminationtype`, 
      examtype, 
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((res) => {
      dispatch(fetchExaminationtypes());
    })
    .catch((error) => {});
};

export const deleteExaminationtype = (id) => async (dispatch) => {
  await axios
    .delete(
      `${process.env.REACT_APP_EXAMINATIONTYPES_URL}/examinationtype/deleteExaminationtype/${id}`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((res) => {
      dispatch(fetchExaminationtypes());
    })
    .catch((error) => {});
}