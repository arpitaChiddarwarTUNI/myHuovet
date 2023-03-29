import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";

import { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import { editSingleAppointment } from "../../store/features/appointmentsSlice";
import { fetchMedicines } from "../../store/features/medicineSlice";

const SingleMedicine = ({ singleMedicine, closeMedicine }) => {
  const [medicine, setMedicine] = useState("");
  const [medicineAmount, setMedicineAmount] = useState(1);
  const dispatch = useDispatch();
  const medicineList = useSelector((state) => state.medicines);
  const appointments = useSelector((state) => state.appointments);

  useEffect(() => {
    dispatch(fetchMedicines())
  }, []);

  const handleSave = (id, amount) => {
    const medicineObject = {
      medicine_id: id,
      amount: amount,
      dosage: 1,
    };
    let medicineArray = appointments.singleAppointment.prescriptions.map(
      (item) => {
        return {
          medicine_id: item.medicine_id,
          amount: item.amount,
          dosage: 1,
        };
      }
    );
    let filteredMeidicineArray = medicineArray.filter(function (el) {
      return el.medicine_id != id;
    });
    if (amount > 0) {
      filteredMeidicineArray.push(medicineObject);
    }

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
      diagnosis: appointments.singleAppointment.diagnosis,
      useds: appointments.singleAppointment.useds,
      prescriptions: filteredMeidicineArray,
    };
    dispatch(editSingleAppointment(appointmentObject));

    closeMedicine();
  };

  useEffect(() => {
    if (singleMedicine) {
      setMedicine(singleMedicine.medicine_id);
      setMedicineAmount(singleMedicine.amount);
    }
  }, [singleMedicine]);

  const handleMedicineChange = (event) => {
    setMedicine(event.target.value);
    handleSave(event.target.value, medicineAmount);
  };

  const handleIncrease = () => {
    handleSave(singleMedicine.medicine_id, medicineAmount + 1);
  };

  const handleDecrease = () => {
    handleSave(singleMedicine.medicine_id, medicineAmount - 1);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: 2,
        marginTop: 2,
      }}
    >
      <FormControl fullWidth>
        <InputLabel variant="filled" required>
          Reseptilääke
        </InputLabel>
        <Select
          variant="filled"
          value={medicine}
          onChange={handleMedicineChange}
          id="medicineType"
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
          {medicineList.medicines.map((med) => {
            return (
              <MenuItem key={med.id} value={med.id}>
                {med.name} {med.strength}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
      {singleMedicine && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 1,
            alignItems: "center",
          }}
        >
          <Button
            variant="contained"
            size="small"
            color="success"
            sx={{ minHeight: 2, minWidth: 30, padding: 0, height: "50%" }}
            onClick={() => {
              handleDecrease();
            }}
          >
            -
          </Button>
          <Typography>{singleMedicine.amount}</Typography>
          <Button
            variant="contained"
            size="small"
            color="success"
            sx={{ minHeight: 2, minWidth: 30, padding: 0, height: "50%" }}
            onClick={() => {
              handleIncrease();
            }}
          >
            +
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default SingleMedicine;
