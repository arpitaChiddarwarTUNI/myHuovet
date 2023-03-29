import {
  Button,
  Card,
  CardHeader,
  Collapse,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  IconButton,
} from "@mui/material";
import { Box } from "@mui/system";
import {
  DatePicker,
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers";
import { useState, useEffect } from "react";
import ClearIcon from "@mui/icons-material/Clear";
import CheckIcon from "@mui/icons-material/Check";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useDispatch, useSelector } from "react-redux";
import { editSingleAppointment } from "../../store/features/appointmentsSlice";

const Schedule = () => {
  const [modifyopen, setModifyopen] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState(null);
  const [time, setTime] = useState(null);
  const [duration, setDuration] = useState("");
  const appointments = useSelector((state) => state.appointments);
  const dispatch = useDispatch();

  const handleDurationChange = (event) => {
    setDuration(event.target.value);
  };

  useEffect(() => {
    if (appointments.singleAppointment.starting_date) {
      const date = new Date(appointments.singleAppointment.starting_date);
      setAppointmentDate(date);
      setTime(date);
      const initialDuration = Math.floor(
        (new Date(appointments.singleAppointment.ending_date.String) -
          new Date(appointments.singleAppointment.starting_date)) /
          1000 /
          60
      );
      setDuration(initialDuration);
    }
  }, [appointments.singleAppointment]);

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
  const handleAppointmentUpdate = () => {
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
      id: appointments.singleAppointment.id,
      starting_date: formattedStartDate,
      ending_date: formattedEndDate,
      length: duration,
      anamnesis: appointments.singleAppointment.anamnesis.String,
      status: appointments.singleAppointment.status.String,
      treatment: appointments.singleAppointment.treatment.String,
      arrived: appointments.singleAppointment.arrived,
      appointment_type_id: appointments.singleAppointment.appointment_type_id,
      staff_id: appointments.singleAppointment.staff_id,
      billed: appointments.singleAppointment.billed,
      patient_id: appointments.singleAppointment.patient_id,
      examinations: appointments.singleAppointment.examinations,
      operations: appointments.singleAppointment.operations,
      diagnosis: appointments.singleAppointment.diagnosis,
      useds: appointments.singleAppointment.useds,
      prescriptions: appointments.singleAppointment.prescriptions,
    };
    dispatch(editSingleAppointment(appointmentObject));
  };

  const resetFields = () => {};
  const renderSelectGroup = (time) => {
    return (
      <MenuItem key={time.value} value={time.value}>
        {time.duration}
      </MenuItem>
    );
  };

  return (
    <Box>
      <Card>
        <CardHeader
          title="Muokkaa ajankohtaa"
          onClick={() => setModifyopen(!modifyopen)}
          sx={{ color: "white" }}
          titleTypographyProps={{ variant: "h6" }}
          action={
            <IconButton sx={{color: "white"}}>
              <ExpandMoreIcon />
            </IconButton>
          }
        />
        <Collapse in={modifyopen}>
          <Box sx={{ padding: 2 }}>
            <Box sx={{ display: "flex", flexDirection: "row", gap: 3 }}>
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale="fi"
                fullWidth
              >
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
                  PopperProps={{
                    sx: {
                      ".MuiPaper-root": {
                        padding: 2,
                        backgroundColor: "white",
                      },
                    },
                  }}
                />
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
              </LocalizationProvider>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
              <Button
                startIcon={<ClearIcon />}
                onClick={() => resetFields()}
                size="large"
                variant="contained"
                color="error"
              >
                Peruuta
              </Button>
              <Button
                type="submit"
                startIcon={<CheckIcon />}
                variant="contained"
                size="large"
                color="success"
                sx={{ ml: 3 }}
                onClick={() => handleAppointmentUpdate()}
              >
                Tallenna
              </Button>
            </Box>
          </Box>
        </Collapse>
      </Card>
    </Box>
  );
};

export default Schedule;
