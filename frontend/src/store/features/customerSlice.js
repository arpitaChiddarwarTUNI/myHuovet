import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  customer: {},
  loading: false,
  error: "",
};
const customerSlice = createSlice({
  name: "customer",
  initialState: initialState,
  reducers: {
    getCustomer(state, action) {
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

export const { getCustomer, setLoading, setErrorMessage } =
  customerSlice.actions;

export const customerSelector = (state) => state.customer;

export default customerSlice.reducer;

export const fetchCustomer = (id) => async (dispatch) => {
  await axios
    .get(`${process.env.REACT_APP_CUSTOMER_URL}/customer/get/${id}`, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      dispatch(getCustomer({ customer: res.data, loading: false, error: "" }));
    })
    .catch((error) => {
      console.log(error.response.data.message);
      dispatch(setErrorMessage(error.response.data.message));
    });
};

export const createCustomer =
  (customerObject, navigate) => async (dispatch) => {
    // api call for creating customer object
    //

    await axios
      .post(
        `${process.env.REACT_APP_CUSTOMER_URL}/customer/create`,
        customerObject,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        navigate(`/customer/${res.data.id}`);
        dispatch(
          getCustomer({ customer: res.data, loading: false, error: "" })
        );
      })
      .catch((error) => {
        dispatch(setErrorMessage(error.response.data.message));
      });
  };

export const updateCustomer = (customerObject) => async (dispatch) => {
  // api call for creating customer object
  //
  dispatch(setLoading(true));
  await axios
    .put(
      `${process.env.REACT_APP_CUSTOMER_URL}/customer/modify`,
      customerObject,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((res) => {
      dispatch(fetchCustomer(customerObject.id));
      dispatch(setLoading(false));
    })
    .catch((error) => {});
};

export const deleteCustomer = (id, navigate) => async (dispatch) => {
  await axios
    .delete(
      `${process.env.REACT_APP_CUSTOMER_URL}/customer/remove/${id}`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((res) => {
      navigate(`/home`)
    })
    .catch((error) => {
      dispatch(setErrorMessage(error.response.data.message));
    });
}