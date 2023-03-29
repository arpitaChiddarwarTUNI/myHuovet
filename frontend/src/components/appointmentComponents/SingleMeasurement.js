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
import { fetchExaminationtypes } from "../../store/features/examinationtypesSlice";

const SingleMeasurement = ({ examination, closeMeasurement }) => {
  const [measurement, setMeasurement] = useState("");
  const [measurementresult, setMeasurementresult] = useState("");
  const dispatch = useDispatch();
  const examList = useSelector((state) => state.examinationtypes);
  const appointments = useSelector((state) => state.appointments);

  useEffect(() => {
    dispatch(fetchExaminationtypes())
  }, []);

  const handleSave = () => {
    const examinationObject = {
      examination_type_id: measurement,
      result: measurementresult,
    };
    let examinationsArray = appointments.singleAppointment.examinations.map(
      (item) => {
        return {
          examination_type_id: item.examination_type_id,
          result: item.result,
        };
      }
    );
    let filteredExamArray = examinationsArray.filter(function (el) {
      return el.examination_type_id != measurement;
    });

    filteredExamArray.push(examinationObject);

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
      examinations: filteredExamArray,
      operations: appointments.singleAppointment.operations,
      diagnosis: appointments.singleAppointment.diagnosis,
      useds: appointments.singleAppointment.useds,
      prescriptions: appointments.singleAppointment.prescriptions,
    };
    dispatch(editSingleAppointment(appointmentObject));
    closeMeasurement();
  };

  useEffect(() => {
    if (examination) {
      setMeasurement(examination.examination_type_id);
      setMeasurementresult(examination.result);
    }
  }, [examination]);

  const handleExamChange = (event) => {
    setMeasurement(event.target.value);
  };

  const resetField = () => {
    if (examination) {
      setMeasurement(examination.examination_type_id);
      setMeasurementresult(examination.result);
    }
  };

  const isDirty = () => {
    return (
      examination.examination_type_id == measurement &&
      measurementresult == examination.result
    );
  };

  return (
    <Box>
      <FormControl fullWidth sx={{ marginTop: 2 }}>
        <InputLabel variant="filled" required>
          Mittaus
        </InputLabel>
        <Select
          variant="filled"
          value={measurement}
          onChange={handleExamChange}
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
          {examList.examinationtypes.filter((exam) =>
            exam.category === "examination").map((exam) => {
            return (
              <MenuItem key={exam.id} value={exam.id}>
                {exam.name}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
      <Box>
        <InputLabel
          variant="filled"
          sx={{ color: "white", marginBottom: 1 }}
          required
        >
          Mittauksen tulos
        </InputLabel>
        <TextField
          fullWidth
          value={measurementresult}
          onChange={(e) => setMeasurementresult(e.target.value)}
          margin="normal"
          id="appointment_measurement"
          name="measurement_result"
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
            examination ? resetField() : closeMeasurement();
          }}
          size="large"
          variant="contained"
          color="error"
          disabled={examination && isDirty()}
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
          disabled={examination && isDirty()}
        >
          Tallenna
        </Button>
      </Box>
    </Box>
  );
};

export default SingleMeasurement;
