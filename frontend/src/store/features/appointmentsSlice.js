import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  loading: false,
  appointments: [],
  singleAppointment: {
    id: "",
    starting_date: "",
    ending_date: {
      String: "",
      Valid: false,
    },
    length: "",
    anamnesis: {
      String: "",
      Valid: false,
    },
    status: {
      String: "",
      Valid: false,
    },
    treatment: {
      String: "",
      Valid: false,
    },
    arrived: false,
    appointment_type_id: "",
    staff_id: "",
    billed: false,
    customer_id: "",
    patient_id: "",
    name: "Doge",
    date_of_birth: {
      String: "",
      Valid: false,
    },
    sex: "",
    examinations: [],
    operations: [],
    diagnosis: [],
    useds: [],
    prescriptions: [],
  },
  customerAppointments: [],
  error: "",
};

const appointmentsSlice = createSlice({
  name: "appointments",
  initialState: initialState,
  reducers: {
    getAppointments(state, action) {
      return {
        ...state,
        appointments: action.payload.appointments,
      };
    },
    getSingleAppointment(state, action) {
      return {
        ...state,
        singleAppointment: action.payload,
      };
    },
    getCustomerAppointments(state, action) {
      return {
        ...state,
        customerAppointments: action.payload,
      };
    },
    modifySingleAppointment(state, action) {
      return {
        ...state,
        singleAppointment: action.payload,
      };
    },
  },
});

export const {
  getAppointments,
  getSingleAppointment,
  getCustomerAppointments,
  modifySingleAppointment,
} = appointmentsSlice.actions;

export const appointmentsSelector = (state) => state.appointments;

export default appointmentsSlice.reducer;

export const fetchAppointments = () => async (dispatch) => {
  await axios
    .get(
      `${process.env.REACT_APP_APPOINTMENT_URL}/appointment/listAllAppointment`,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((res) => {
      dispatch(
        getAppointments({
          appointments: res.data,
          loading: false,
          error: "",
          singleAppointment: {},
        })
      );
    })
    .catch((error) => {
      console.log(error.response.data.message);
    });
};

export const createAppointment =
  (appointmentObject, patientId, navigate) => async (dispatch) => {
    await axios
      .post(
        `${process.env.REACT_APP_APPOINTMENT_URL}/appointment/addAppointment/${patientId}`,
        appointmentObject,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        dispatch(fetchAppointments());
        navigate("/home");
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });
  };

export const fetchSingleAppointment = (id) => async (dispatch) => {
  await axios
    .get(
      `${process.env.REACT_APP_APPOINTMENT_URL}/appointment/getAppointment/${id}`,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((res) => {
      dispatch(getSingleAppointment(res.data));
    })
    .catch((error) => {
      console.log(error.response.data.message);
    });
};

export const fetchCustomerAppointments = (id) => async (dispatch) => {
  await axios
    .get(
      `${process.env.REACT_APP_APPOINTMENT_URL}/appointment/customerAppointments/${id}`,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((res) => {
      dispatch(getCustomerAppointments(res.data));
    })
    .catch((error) => {
      console.log(error.response.data.message);
    });
};

export const editSingleAppointment = (appointmentData) => async (dispatch) => {
  await axios
    .put(
      `${process.env.REACT_APP_APPOINTMENT_URL}/appointment/modifyAppointment`,
      appointmentData,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((res) => {
      dispatch(fetchSingleAppointment(appointmentData.id));
    })
    .catch((error) => {
      console.log(error.response.data.message);
    });
};

export const billedAppointment = (id) => async (dispatch) => {
  await axios
    .put(
      `${process.env.REACT_APP_APPOINTMENT_URL}/appointment/billedAppointment/${id}`,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((res) => {
      dispatch(getSingleAppointment(res.data));
    })
    .catch((error) => {
      console.log(error.response.data.message);
    });
};

export const deleteAppointment = (id) => async (dispatch) => {
  await axios
    .delete(
      `${process.env.REACT_APP_APPOINTMENT_URL}/appointment/deleteAppointment/${id}`,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((res) => {
      dispatch(getCustomerAppointments(res.data));
    })
    .catch((error) => {
      console.log(error.response.data.message);
    });
};