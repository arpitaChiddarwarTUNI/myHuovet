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

const SingleOperation = ({ operation, closeOperation }) => {
  const [measure, setMeasure] = useState("");
  const [measureResult, setMeasureResult] = useState("");
  const dispatch = useDispatch();
  const operationsList = useSelector((state) => state.examinationtypes);
  const appointments = useSelector((state) => state.appointments);
  const handleMeasurementInput = () => {
    // setmeasurementOptions()...
  };

  const handleSave = () => {
    const operationObject = {
      examination_type_id: measure,
      result: measureResult,
    };
    let operationsArray = appointments.singleAppointment.operations.map(
      (item) => {
        return {
          examination_type_id: item.examination_type_id,
          result: item.result,
        };
      }
    );
    let filteredOperationsArray = operationsArray.filter(function (el) {
      return el.examination_type_id != measure;
    });

    filteredOperationsArray.push(operationObject);

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
      operations: filteredOperationsArray,
      diagnosis: appointments.singleAppointment.diagnosis,
      useds: appointments.singleAppointment.useds,
      prescriptions: appointments.singleAppointment.prescriptions,
    };
    dispatch(editSingleAppointment(appointmentObject));
    closeOperation();
  };

  useEffect(() => {
    if (operation) {
      setMeasure(operation.examination_type_id);
      setMeasureResult(operation.result);
    }
  }, [operation]);

  const handleMeasureChange = (event) => {
    setMeasure(event.target.value);
  };

  const resetField = () => {
    if (operation) {
      setMeasure(operation.examination_type_id);
      setMeasureResult(operation.result);
    }
  };

  const isDirty = () => {
    return (
      operation.examination_type_id == measure &&
      measureResult == operation.result
    );
  };

  return (
    <Box>
      <FormControl fullWidth sx={{ marginTop: 2 }}>
        <InputLabel variant="filled" required>
          Operaatio
        </InputLabel>
        <Select
          variant="filled"
          value={measure}
          onChange={handleMeasureChange}
          id="measureType"
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
          {operationsList.examinationtypes.filter((exam) =>
            exam.category === "operation").map((operation) => {
            return (
              <MenuItem key={operation.id} value={operation.id}>
                {operation.name}
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
          value={measureResult}
          onChange={(e) => setMeasureResult(e.target.value)}
          margin="normal"
          id="operation_result"
          name="operation_result"
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
            operation ? resetField() : closeOperation();
          }}
          size="large"
          variant="contained"
          color="error"
          disabled={operation && isDirty()}
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
          disabled={operation && isDirty()}
        >
          Tallenna
        </Button>
      </Box>
    </Box>
  );
};

export default SingleOperation;
