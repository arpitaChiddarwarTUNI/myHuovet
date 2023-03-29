import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  species: [],
};

const speciesSlice = createSlice({
  name: "species",
  initialState: initialState,
  reducers: {
    getSpecies(state, action) {
      return action.payload;
    },
  },
});

export const { getSpecies } = speciesSlice.actions;

export const speciesSelector = (state) => state.species;

export default speciesSlice.reducer;

export const fetchSpecies = () => async (dispatch) => {
  await axios
    .get(`${process.env.REACT_APP_SPECIES_URL}/species/getSpeciesAll`, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      dispatch(getSpecies({ species: res.data }));
    })
    .catch((error) => {});
};

export const postSpecie = (specie) => async (dispatch) => {
  await axios
    .post(`${process.env.REACT_APP_SPECIES_URL}/species/addSpecies`, specie, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      //console.log(res.data);
      dispatch(fetchSpecies());
    })
    .catch((error) => {});
};

export const postBreed = (breed) => async (dispatch) => {
  await axios
    .post(`${process.env.REACT_APP_BREEDS_URL}/breed/addBreed`, breed, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      dispatch(fetchSpecies());
    })
    .catch((error) => {});
};

export const modifySpecie = (specie) => async (dispatch) => {
  await axios
    .put(`${process.env.REACT_APP_SPECIES_URL}/species/modifySpecies`, specie, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      dispatch(fetchSpecies());
    })
    .catch((error) => {});
};

export const modifyBreed = (breed) => async (dispatch) => {
  await axios
    .put(`${process.env.REACT_APP_BREEDS_URL}/breed/modifyBreed`, breed, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      dispatch(fetchSpecies());
    })
    .catch((error) => {});
};

export const deleteSpecie = (id) => async (dispatch) => {
  await axios
    .delete(`${process.env.REACT_APP_SPECIES_URL}/species/deleteSpecies/${id}`, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      dispatch(fetchSpecies());
    })
    .catch((error) => {});
};

export const deleteBreed = (id) => async (dispatch) => {
  await axios
    .delete(`${process.env.REACT_APP_BREEDS_URL}/breed/deleteBreed/${id}`, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      dispatch(fetchSpecies());
    })
    .catch((error) => {});
};
