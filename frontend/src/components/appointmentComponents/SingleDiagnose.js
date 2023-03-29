import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";

import { useState, useEffect } from "react";
import ClearIcon from "@mui/icons-material/Clear";
import CheckIcon from "@mui/icons-material/Check";
import { useDispatch, useSelector } from "react-redux";
import { editSingleAppointment } from "../../store/features/appointmentsSlice";
import { fetchDiagnosetypes } from "../../store/features/diagnosetypesSlice";

const SingleDiagnose = ({ singleDiagnose, closeDiagnose }) => {
  const [diagnose, setDiagnose] = useState("");
  const [diagnosetxt, setDiagnosetxt] = useState("");
  const dispatch = useDispatch();
  const diagnoseList = useSelector((state) => state.diagnosetypes);
  const appointments = useSelector((state) => state.appointments);

  useEffect(() => {
    dispatch(fetchDiagnosetypes())
  }, []);

  useEffect(() => {
    if (singleDiagnose) {
      setDiagnose(singleDiagnose.diagnosis_id);
      setDiagnosetxt(singleDiagnose.info_text);
    }
  }, [singleDiagnose]);

  const handleDiagnoseChange = (event) => {
    setDiagnose(event.target.value);
  };

  const resetField = () => {
    if (singleDiagnose) {
      setDiagnose(singleDiagnose.diagnosis_id);
      setDiagnosetxt(singleDiagnose.info_text);
    }
  };

  const isDirty = () => {
    return (
      singleDiagnose.diagnosis_id == diagnose &&
      singleDiagnose.info_text == diagnosetxt
    );
  };

  const handleSave = () => {
    const diagnoseObject = {
      diagnosis_id: diagnose,
      info_text: diagnosetxt,
    };
    let diagnosisArray = appointments.singleAppointment.diagnosis.map(
      (item) => {
        return {
          diagnosis_id: item.diagnosis_id,
          info_text: item.info_text,
        };
      }
    );
    let filteredDiagArray = diagnosisArray.filter(function (el) {
      return el.diagnosis_id != diagnose;
    });

    filteredDiagArray.push(diagnoseObject);

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
      appointment_type_id: appointments.singleAppointment.appointment_type_id,
      staff_id: appointments.singleAppointment.staff_id,
      billed: appointments.singleAppointment.billed,
      patient_id: appointments.singleAppointment.patient_id,
      examinations: appointments.singleAppointment.examinations,
      operations: appointments.singleAppointment.operations,
      diagnosis: filteredDiagArray,
      useds: appointments.singleAppointment.useds,
      prescriptions: appointments.singleAppointment.prescriptions,
    };
    dispatch(editSingleAppointment(appointmentObject));
    closeDiagnose();
  };

  return (
    <Box>
      <FormControl fullWidth sx={{ marginTop: 2 }}>
        <InputLabel variant="filled" required>
          Diagnoosi
        </InputLabel>
        <Select
          variant="filled"
          value={diagnose}
          onChange={handleDiagnoseChange}
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
          {diagnoseList.diagnosetypes.map((diag) => {
            return (
              <MenuItem key={diag.id} value={diag.id}>
                {diag.name}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
      <Box>
        <InputLabel
          variant="filled"
          sx={{ color: "white", marginBottom: 1 }}
        >
          Lisätietoja
        </InputLabel>
        <TextField
          fullWidth
          value={diagnosetxt}
          onChange={(e) => setDiagnosetxt(e.target.value)}
          margin="normal"
          id="appointment_diagnosetxt"
          name="diagnose_txt"
          sx={{
            backgroundColor: "white",
            borderRadius: 1,
          }}
        />
      </Box>
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
          onClick={() => {
            singleDiagnose ? resetField() : closeDiagnose();
          }}
          size="large"
          variant="contained"
          color="error"
          disabled={singleDiagnose && isDirty()}
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
          disabled={singleDiagnose && isDirty()}
        >
          Tallenna
        </Button>
      </Box>
    </Box>
  );
};

export default SingleDiagnose;
