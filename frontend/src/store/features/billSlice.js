import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  loading: false,
  singleBill: {
    appointment_id: "",
    bill_number: "",
    due_date: "",
    examinations: [],
    paid: false,
    service_price: 0,
    supplies: [],
  },
  error: "",
};

const billSlice = createSlice({
  name: "bill",
  initialState: initialState,
  reducers: {
    getSingleBill(state, action) {
      return {
        ...state,
        singleBill: action.payload,
      };
    },
  },
});

export const { getSingleBill } = billSlice.actions;

export const billSelector = (state) => state.bills;

export default billSlice.reducer;

export const fetchBill = (id) => async (dispatch) => {
  await axios
    .get(`${process.env.REACT_APP_BILL_URL}/billing/getBill/${id}`, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      dispatch(getSingleBill(res.data));
    })
    .catch((error) => {
      dispatch(
        getSingleBill({
          appointment_id: "",
          bill_number: "",
          due_date: "",
          examinations: [],
          paid: false,
          service_price: 0,
          supplies: [],
        })
      );
      console.log(error.response.data.message);
    });
};

export const createBill = (bill) => async (dispatch) => {
  await axios
    .post(`${process.env.REACT_APP_BILL_URL}/billing/addBill`, bill, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      dispatch(fetchBill(bill.appointment_id));
    })
    .catch((error) => {
      console.log(error.response.data.message);
    });
};

export const modifyBill = (bill) => async (dispatch) => {
  await axios
    .put(`${process.env.REACT_APP_BILL_URL}/billing/modifyBill`, bill, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      dispatch(fetchBill(bill.appointment_id));
    })
    .catch((error) => {
      console.log(error.response.data.message);
    });
};

// This might not be needed.
// export const deleteBill = (id) => async (dispatch) => {
//   await axios
//     .delete(`${process.env.REACT_APP_BILL_URL}/billing/deleteBill/${id}`,
//       {
//         withCredentials: true,
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     )
//     .then((res) => {
//       dispatch();
//     })
//     .catch((error) => {
//       console.log(error.response.data.message);
//     });
// };
