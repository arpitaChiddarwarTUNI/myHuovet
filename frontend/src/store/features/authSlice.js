import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  loggedIn: false,
  loading: false,
  loadingFromRefresh: true,
  error: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    logInSuccess(state, action) {
      return action.payload;
    },
    logOutSuccess(state, action) {
      return action.payload;
    },
    clearAuthError(state) {
      return { ...state, error: "" };
    },
  },
});

export const { logInSuccess, logOutSuccess, clearAuthError } =
  authSlice.actions;

export const authSelector = (state) => state.auth;

export default authSlice.reducer;

export const initAuth = () => async (dispatch) => {
  dispatch(
    logInSuccess({
      loggedIn: false,
      loading: true,
      error: "",
      loadingFromRefresh: true,
    })
  );
  try {
    await axios
      .get(`${process.env.REACT_APP_AUTH_URL}/auth/user`, {
        // important
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        dispatch(
          logInSuccess({
            loggedIn: true,
            loading: false,
            error: "",
            loadingFromRefresh: false,
          })
        );
      })
      .catch((error) => {
        dispatch(
          logInSuccess({
            loggedIn: false,
            loading: false,
            error: "",
            loadingFromRefresh: false,
          })
        );
      });
  } catch (e) {
    dispatch(
      logInSuccess({
        loggedIn: false,
        loading: false,
        error: "Error, something went wrong.",
        loadingFromRefresh: false,
      })
    );
    return console.error(e.message);
  }
};

export const login = (username, password) => async (dispatch) => {
  try {
    dispatch(
      logInSuccess({
        loggedIn: false,
        loading: true,
        error: "",
        loadingFromRefresh: false,
      })
    );
    const payload = { email: username, password: password };
    await axios
      .post(`${process.env.REACT_APP_AUTH_URL}/auth/login`, payload, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        dispatch(
          logInSuccess({
            loggedIn: true,
            loading: false,
            error: "",
            loadingFromRefresh: false,
          })
        );
      })
      .catch((error) => {
        dispatch(
          logInSuccess({
            loggedIn: false,
            loading: false,
            error: error.response.data.message,
          })
        );
      });
  } catch (e) {
    dispatch(
      logInSuccess({
        loggedIn: false,
        loading: false,
        error: "Error, something went wrong.",
        loadingFromRefresh: false,
      })
    );
    return console.error(e.message);
  }
};

export const logout = () => async (dispatch) => {
  try {
    dispatch(
      logOutSuccess({
        loggedIn: false,
        loading: true,
        error: "",
        loadingFromRefresh: false,
      })
    );
    await axios
      .post(
        `${process.env.REACT_APP_AUTH_URL}/auth/logout`,
        {},
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        dispatch(
          logOutSuccess({
            loggedIn: false,
            loading: false,
            error: "",
            loadingFromRefresh: false,
          })
        );
      })
      .catch((error) => {
        dispatch(
          logOutSuccess({
            loggedIn: false,
            loading: false,
            error: error.response.data.message,
          })
        );
      });
  } catch (e) {
    dispatch(
      logInSuccess({
        loggedIn: false,
        loading: false,
        error: "Error, something went wrong.",
        loadingFromRefresh: false,
      })
    );
    return console.error(e.message);
  }
};
