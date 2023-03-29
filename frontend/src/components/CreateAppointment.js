import { Container, Box } from "@mui/system";
import { TextField, Typography, Grid, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import "dayjs/locale/fi";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import ClearIcon from "@mui/icons-material/Clear";
import CheckIcon from "@mui/icons-material/Check";
import SearchCustomer from "./SearchCustomer";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { createAppointment } from "../store/features/appointmentsSlice";
import { useNavigate } from "react-router-dom";
import { fetchBill, createBill, modifyBill } from "../store/features/billSlice"

const CreateAppointment = () => {
  const timeList = [
    {
      duration: "15 min",
      value: 15,
    },
    {
      duration: "30 min",
      value: 30,
    },
    {
      duration: "45 min",
      value: 45,
    },
    {
      duration: "1 h",
      value: 60,
    },
    {
      duration: "1 h 15 min",
      value: 75,
    },
    {
      duration: "1 h 30 min",
      value: 90,
    },
    {
      duration: "1 h 45 min",
      value: 105,
    },
    {
      duration: "2 h",
      value: 120,
    },
    {
      duration: "2 h 15 min",
      value: 135,
    },
    {
      duration: "2 h 30 min",
      value: 150,
    },
    {
      duration: "2 h 45 min",
      value: 165,
    },
    {
      duration: "3 h",
      value: 180,
    },
  ];
 
  const appointmentList = useSelector((state) => state.appointmenttypes.appointmenttypes);
  const staffSelector = useSelector((state) => state.staff);
  const [customer, setCustomer] = useState("");
  const [patient, setPatient] = useState("");
  const [appointmentDate, setAppointmentDate] = useState(null);
  const [time, setTime] = useState(null);
  const [duration, setDuration] = useState("");
  const [staff, setStaff] = useState("");
  const [appointmentType, setAppointmentType] = useState("");
  const customerSelector = useSelector((state) => state.customer);
  const patientsSelector = useSelector((state) => state.patients);
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (params.startdate) {
      const paramDate = new Date(params.startdate);
      setAppointmentDate(paramDate);
      setTime(paramDate);
    }
  }, []);

  useEffect(() => {
    setPatient("");
  }, [patientsSelector.patients]);

  useEffect(() => {
    setCustomer(customerSelector.customer.id);
  }, [customerSelector.customer]);

  const renderSelectGroup = (time) => {
    return (
      <MenuItem key={time.value} value={time.value}>
        {time.duration}
      </MenuItem>
    );
  };

  const handleDurationChange = (event) => {
    setDuration(event.target.value);
  };

  const handlePatientChange = (event) => {
    setPatient(event.target.value);
  };

  const handleStaffChange = (event) => {
    setStaff(event.target.value);
  };

  const handleAppointmentTypeChange = (event) => {
    setAppointmentType(event.target.value);
    {appointmentList.filter(type => 
      type.id === event.target.value).map(type =>
        setDuration(type.default_length)
      )}
  };

  const isDateValid = () => {
    if (appointmentDate == null || time == null) return false;
    if (appointmentDate) {
      if (appointmentDate.$d != "Invalid Date" && time.$d != "Invalid Date")
        return true;
      return false;
    }
  };

  const handleSave = () => {
    let startDateObject = appointmentDate;
    let startTimeObject = time;
    if (startDateObject.hasOwnProperty("$d")) {
      startDateObject = appointmentDate.$d;
    }
    if (startTimeObject.hasOwnProperty("$d")) {
      startTimeObject = time.$d;
    }
    const formattedStartDate =
      startDateObject.getFullYear() +
      "-" +
      ("0" + (startDateObject.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + startDateObject.getDate()).slice(-2) +
      "T" +
      ("0" + startTimeObject.getHours()).slice(-2) +
      ":" +
      ("0" + startTimeObject.getMinutes()).slice(-2) +
      ":" +
      ("0" + startTimeObject.getSeconds()).slice(-2);

    const endTime = new Date(startTimeObject.getTime() + duration * 60000);
    const formattedEndDate =
      startDateObject.getFullYear() +
      "-" +
      ("0" + (startDateObject.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + startDateObject.getDate()).slice(-2) +
      "T" +
      ("0" + endTime.getHours()).slice(-2) +
      ":" +
      ("0" + endTime.getMinutes()).slice(-2) +
      ":" +
      ("0" + endTime.getSeconds()).slice(-2);
    const appointmentObject = {
      appointment_type_id: appointmentType,
      arrived: false,
      ending_date: formattedEndDate,
      length: duration,
      staff_id: staff,
      starting_date: formattedStartDate,
    };
    dispatch(createAppointment(appointmentObject, patient, navigate));
  };

  return (
    <Container
      sx={{
        backgroundColor: "secondary.main",
        mt: 5,
        padding: 5,
        paddingX: 5,
        paddingTop: 4,
        paddingBottom: 4,
        borderRadius: "1%",
        boxShadow: 22,
      }}
      component="main"
      maxWidth="sm"
    >
      <Box>
        <Typography variant="h5" color="white">
          Uusi käynti
        </Typography>
        <Grid
          container
          sx={{
            display: "flex",
            flexDirection: "row",
            marginY: 2,
            justifyContent: "space-between",
          }}
        >
          <Grid item xs={12} sm={5.5}>
            <SearchCustomer appointment={true} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel variant="filled" required>
                Potilas
              </InputLabel>
              <Select
                variant="filled"
                value={patient}
                onChange={handlePatientChange}
                id="patient_species"
                label="Laji"
                style={{ backgroundColor: "#f0f0f0" }}
                disabled={patientsSelector.patients.length == 0}
                sx={{
                  borderRadius: 1,
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      backgroundColor: "#f0f0f0",
                      color: "black",
                    },
                  },
                }}
              >
                {patientsSelector.patients.map((patient) => {
                  return (
                    <MenuItem key={patient.id} value={patient.id}>
                      {patient.name}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Grid
          container
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale="fi"
            fullWidth
          >
            <Grid item xs={12} sm={5.5}>
              <DatePicker
                fullWidth
                id="appointment_date"
                label="Päivämäärä"
                value={appointmentDate}
                onChange={(newValue) => {
                  setAppointmentDate(newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    required
                    fullWidth
                    variant="filled"
                    sx={{
                      backgroundColor: "white",
                      borderRadius: 1,
                      marginY: 1,
                    }}
                    {...params}
                  />
                )}
                minDate={new Date()}
                PopperProps={{
                  sx: {
                    ".MuiPaper-root": {
                      padding: 2,
                      backgroundColor: "white",
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={5.5} sm={3}>
              <TimePicker
                fullWidth
                label="Kellonaika"
                value={time}
                onChange={(newValue) => {
                  setTime(newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    required
                    fullWidth
                    variant="filled"
                    sx={{
                      backgroundColor: "white",
                      borderRadius: 1,
                      marginY: 1,
                    }}
                    {...params}
                  />
                )}
                PopperProps={{
                  sx: {
                    ".MuiPaper-root": {
                      padding: 2,
                      backgroundColor: "white",
                    },
                  },
                }}
              />
            </Grid>
          </LocalizationProvider>
          <Grid item xs={6} sm={2.5}>
            <FormControl fullWidth>
              <InputLabel variant="filled" required sx={{ marginY: 1 }}>
                Kesto
              </InputLabel>
              <Select
                variant="filled"
                id="duration"
                label="Kesto"
                value={duration}
                onChange={handleDurationChange}
                style={{
                  backgroundColor: "#f0f0f0",
                }}
                sx={{
                  borderRadius: 1,
                  marginY: 1,
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      backgroundColor: "#f0f0f0",
                      color: "black",
                    },
                  },
                }}
              >
                {timeList.map((time) => renderSelectGroup(time))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Grid
          container
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Grid item xs={12} sm={5.5}>
            <FormControl fullWidth sx={{ marginY: 2 }}>
              <InputLabel variant="filled" required>
                Lääkäri
              </InputLabel>
              <Select
                variant="filled"
                value={staff}
                onChange={handleStaffChange}
                id="staff"
                style={{ backgroundColor: "#f0f0f0" }}
                sx={{
                  borderRadius: 1,
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      backgroundColor: "#f0f0f0",
                      color: "black",
                    },
                  },
                }}
              >
                {staffSelector.staff.map((staff) => {
                  return (
                    <MenuItem key={staff.id} value={staff.id}>
                      {staff.first_name} {staff.last_name}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid>
          {/*
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              multiline={true}
              rows={4}
              variant="filled"
              sx={{
                backgroundColor: "white",
                borderRadius: 1,
                marginY: 2,
              }}
              label="Käynnin tarkoitus"
            />
          </Grid>*/}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth sx={{ marginY: 2 }}>
              <InputLabel variant="filled" required>
                Käynnin syy
              </InputLabel>
              <Select
                variant="filled"
                value={appointmentType}
                onChange={handleAppointmentTypeChange}
                id="appointmentType"
                style={{ backgroundColor: "#f0f0f0" }}
                sx={{
                  borderRadius: 1,
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      backgroundColor: "#f0f0f0",
                      color: "black",
                    },
                  },
                }}
              >
                {appointmentList.map((appointmentType) => {
                  return (
                    <MenuItem
                      key={appointmentType.id}
                      value={appointmentType.id}
                    >
                      {appointmentType.name}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Grid
          container
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            flexDirection: "row",
          }}
        >
          <Grid item>
            <Button
              startIcon={<ClearIcon />}
              size="large"
              variant="contained"
              color="error"
              sx={{
                marginX: 1,
                marginBottom: 2,
                maxWidth: 125,
              }}
              onClick={() => {
                navigate("/home");
              }}
            >
              Peruuta
            </Button>
          </Grid>
          <Grid item>
            <Button
              type="submit"
              startIcon={<CheckIcon />}
              variant="contained"
              size="large"
              color="success"
              sx={{
                marginX: 1,
                marginBottom: 2,
                maxWidth: 125,
              }}
              onClick={() => handleSave()}
              disabled={
                !isDateValid() ||
                customer == "" ||
                patient == "" ||
                staff == "" ||
                appointmentType == "" ||
                !time ||
                !duration ||
                appointmentDate == null
              }
            >
              Tallenna
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default CreateAppointment;
