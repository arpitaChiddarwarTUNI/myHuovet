import {
  Button,
  Card,
  CardHeader,
  Collapse,
  TextField,
  IconButton,
} from "@mui/material";
import { Box } from "@mui/system";
import { useState, useEffect } from "react";
import ClearIcon from "@mui/icons-material/Clear";
import CheckIcon from "@mui/icons-material/Check";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useDispatch, useSelector } from "react-redux";
import { editSingleAppointment } from "../../store/features/appointmentsSlice";

const Status = ({ open }) => {
  const [statusopen, setStatusopen] = useState(false);
  const [status, setStatus] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    setStatusopen(open);
  }, [open]);

  const isDirty = () => {
    return appointments.singleAppointment.status.String == status;
  };
  const appointments = useSelector((state) => state.appointments);

  useEffect(() => {
    setStatus(appointments.singleAppointment.status.String);
  }, [appointments.singleAppointment.status]);

  const resetField = () => {
    setStatus(appointments.singleAppointment.status.String);
  };

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
      status: status,
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

  return (
    <Box>
      <Card>
        <CardHeader
          title="Nykytila (status)"
          onClick={() => setStatusopen(!statusopen)}
          sx={{ color: "white" }}
          titleTypographyProps={{ variant: "h6" }}
          action={
            <IconButton sx={{ color: "white" }}>
              <ExpandMoreIcon />
            </IconButton>
          }
        />
        <Collapse in={statusopen} sx={{ paddingX: 2 }}>
          <TextField
            fullWidth
            value={status}
            multiline
            rows={3}
            onChange={(e) => setStatus(e.target.value)}
            margin="normal"
            id="appointment_stauts"
            name="status"
            sx={{
              backgroundColor: "white",
              borderRadius: 1,
            }}
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 2,
              marginBottom: 2,
            }}
          >
            <Button
              startIcon={<ClearIcon />}
              size="large"
              variant="contained"
              color="error"
              disabled={isDirty()}
              onClick={() => resetField()}
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
              disabled={isDirty()}
              onClick={() => handleSave()}
            >
              Tallenna
            </Button>
          </Box>
        </Collapse>
      </Card>
    </Box>
  );
};

export default Status;
