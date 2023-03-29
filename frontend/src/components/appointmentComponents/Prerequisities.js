import { Button, Card, CardHeader, Collapse, TextField , IconButton} from "@mui/material";
import { Box } from "@mui/system";

import { useState, useEffect } from "react";
import ClearIcon from "@mui/icons-material/Clear";
import CheckIcon from "@mui/icons-material/Check";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useDispatch, useSelector } from "react-redux";
import { editSingleAppointment } from "../../store/features/appointmentsSlice";

const Prerequisities = ({ open }) => {
  const [prerequisityopen, setPrerequisityopen] = useState(false);
  const [prerequisities, setPrerequisities] = useState("");
  const dispatch = useDispatch();

  const isDirty = () => {
    return appointments.singleAppointment.anamnesis.String == prerequisities;
  };
  const appointments = useSelector((state) => state.appointments);

  useEffect(() => {
    setPrerequisities(appointments.singleAppointment.anamnesis.String);
  }, [appointments.singleAppointment.anamnesis]);

  useEffect(() => {
    setPrerequisityopen(open);
  }, [open]);

  const resetField = () => {
    setPrerequisities(appointments.singleAppointment.anamnesis.String);
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
      anamnesis: prerequisities,
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

  return (
    <Box>
      <Card>
        <CardHeader
          title="Esitiedot (anamneesi)"
          onClick={() => setPrerequisityopen(!prerequisityopen)}
          sx={{ color: "white" }}
          titleTypographyProps={{ variant: "h6" }}
          action={
            <IconButton sx={{color: "white"}}>
              <ExpandMoreIcon />
            </IconButton>
          }
        />
        <Collapse in={prerequisityopen} sx={{ paddingX: 2 }}>
          <TextField
            value={prerequisities}
            multiline
            fullWidth
            rows={3}
            onChange={(e) => setPrerequisities(e.target.value)}
            margin="normal"
            id="appointment_prequisities"
            name="prequisities"
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
              onClick={() => resetField()}
              size="large"
              variant="contained"
              color="error"
              disabled={isDirty()}
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
              onClick={() => handleSave()}
              disabled={isDirty()}
            >
              Tallenna
            </Button>
          </Box>
        </Collapse>
      </Card>
    </Box>
  );
};

export default Prerequisities;
