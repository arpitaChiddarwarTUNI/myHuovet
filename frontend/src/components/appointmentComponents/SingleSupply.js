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

const SingleSupply = ({ singleSupply, closeSupply }) => {
  const [supply, setSupply] = useState("");
  const [supplyAmount, setSupplyAmount] = useState(1);
  const dispatch = useDispatch();
  const appointments = useSelector((state) => state.appointments);
  const supplySelector = useSelector((state) => state.supplies);

  const handleSave = (id, amount) => {
    const supplyObject = {
      supplies_id: id,
      amount: amount,
    };
    let suppliesArray = appointments.singleAppointment.useds.map((item) => {
      return {
        supplies_id: item.supplies_id,
        amount: item.amount,
      };
    });
    let filteredSuppliesArray = suppliesArray.filter(function (el) {
      return el.supplies_id != id;
    });
    if (amount > 0) {
      filteredSuppliesArray.push(supplyObject);
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
      useds: filteredSuppliesArray,
      prescriptions: appointments.singleAppointment.prescriptions,
    };
    dispatch(editSingleAppointment(appointmentObject));

    closeSupply();
  };

  useEffect(() => {
    if (singleSupply) {
      setSupply(singleSupply.supplies_id);
      setSupplyAmount(singleSupply.amount);
    }
  }, [singleSupply]);

  const handleSupplyChange = (event) => {
    setSupply(event.target.value);
    handleSave(event.target.value, supplyAmount);
  };

  const handleIncrease = () => {
    handleSave(singleSupply.supplies_id, supplyAmount + 1);
  };

  const handleDecrease = () => {
    handleSave(singleSupply.supplies_id, supplyAmount - 1);
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
          Tarvike
        </InputLabel>
        <Select
          variant="filled"
          value={supply}
          onChange={handleSupplyChange}
          id="supplyType"
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
          {supplySelector.supplies.map((sup) => {
            return (
              <MenuItem key={sup.id} value={sup.id}>
                {sup.name}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
      {singleSupply && (
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
          <Typography>{singleSupply.amount}</Typography>
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

export default SingleSupply;
