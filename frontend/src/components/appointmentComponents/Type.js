import {
  Alert,
  Autocomplete,
  Button,
  Card,
  CardHeader,
  Collapse,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TextField,
  Typography,
} from "@mui/material";
import { Box, Container } from "@mui/system";
import {
  DatePicker,
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers";
import { useState, useEffect } from "react";
import ClearIcon from "@mui/icons-material/Clear";
import CheckIcon from "@mui/icons-material/Check";
import AddIcon from "@mui/icons-material/Add";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { editSingleAppointment } from "../../store/features/appointmentsSlice";
import { fetchAppointmenttypes } from "../../store/features/appointmenttypesSlice";

const Type = () => {
  const [appointmentType, setAppointmentType] = useState("");
  const appointmentList = useSelector((state) => state.appointmenttypes);
  const appointments = useSelector((state) => state.appointments);
  const dispatch = useDispatch();

  useEffect(() => {
    setAppointmentType(appointments.singleAppointment.appointment_type_id);
  }, [appointments.singleAppointment]);

  useEffect(() => {
    dispatch(fetchAppointmenttypes())
  }, []);

  const handleSave = () => {
    const appointmentObject = {
      id: appointments.singleAppointment.id,
      starting_date: appointments.singleAppointment.starting_date
        .toString()
        .replace(/ /g, "T"),
      ending_date:
        appointments.singleAppointment.ending_date.String.toString().replace(
          / /g,
          "T"
        ),
      length: appointments.singleAppointment.length,
      anamnesis: appointments.singleAppointment.anamnesis.String,
      status: appointments.singleAppointment.status.String,
      treatment: appointments.singleAppointment.treatment.String,
      arrived: appointments.singleAppointment.arrived,
      appointment_type_id: appointmentType,
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

  const handleAppointmentTypeChange = (event) => {
    setAppointmentType(event.target.value);
  };

  const appointmentTypeChanged = () => {
    return appointmentType !== appointments.singleAppointment.appointment_type_id
  };

  return (
    <Box sx={{display: "flex", flexDirection: "row", gap: 1}}>
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
          {appointmentList.appointmenttypes.map((appointmentType) => {
            return (
              <MenuItem key={appointmentType.id} value={appointmentType.id}>
                {appointmentType.name}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
      <Button
        type="submit"
        variant="contained"
        color="success"
        startIcon={<CheckIcon />}
        sx={{height: 56, marginTop: 2, width: 150}}
        disabled={!appointmentTypeChanged()}
        onClick={() => handleSave()}
        >
        Tallenna
      </Button>
    </Box>
  );
};

export default Type;
