import { Button, Divider, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";

import AddIcon from "@mui/icons-material/Add";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { createBill as newBill } from "../../store/features/billSlice";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const NewBill = () => {
  const [servicePrice, setServicePrice] = useState(35);
  const [examinations, setExaminations] = useState([]);
  const [operations, setOperations] = useState([]);
  const [useds, setUseds] = useState([]);
  const [duedate, setDuedate] = useState(null);
  const appointments = useSelector((state) => state.appointments);
  const dispatch = useDispatch();
  useEffect(() => {
    setExaminations(appointments.singleAppointment.examinations);
    setOperations(appointments.singleAppointment.operations);
    setUseds(appointments.singleAppointment.useds);
  }, [appointments.singleAppointment]);

  useEffect(() => {
    const date = new Date();
    const monthFromNow = new Date(date.setMonth(date.getMonth() + 1));
    setDuedate(monthFromNow);
  }, []);

  const changeExaminationsPrice = (e, examinationId) => {
    const updatedData = examinations.map((x) =>
      x.examination_type_id === examinationId
        ? { ...x, price: e.target.value }
        : x
    );
    setExaminations(updatedData);
  };
  const changeOperationsPrice = (e, operationId) => {
    const updatedData = operations.map((x) =>
      x.examination_type_id === operationId
        ? { ...x, price: e.target.value }
        : x
    );
    setOperations(updatedData);
  };

  const changeUsedsPrice = (e, supplyId) => {
    const updatedData = useds.map((x) =>
      x.supplies_id === supplyId ? { ...x, price: e.target.value } : x
    );
    setUseds(updatedData);
  };

  const isDateValid = () => {
    if (duedate == null) return false;
    if (duedate) {
      if (duedate.$d != "Invalid Date")
        return true;
      return false;
    }
  };

  const displaySupplyUnit = (unit) => {
    if (unit === "pcs") {
      return "kpl";
    } else {
      return unit;
    }
  };

  const calcTotal = () => {
    const usedsPrice = useds.reduce((a, b) => (parseFloat(a) + parseFloat(b.price) * b.amount).toFixed(2), 0);
    const examinationsPrice = examinations.reduce((a, b) => (parseFloat(a) + parseFloat(b.price)).toFixed(2), 0);
    const operationsPrice = operations.reduce((a, b) => (parseFloat(a) + parseFloat(b.price)).toFixed(2), 0);
    return (
      (parseFloat(usedsPrice) +
      parseFloat(servicePrice) +
      parseFloat(examinationsPrice) +
      parseFloat(operationsPrice)).toFixed(2)
    );
  };

  const validateFloat = (value) => {
    if (!isNaN(value) && value > 0) return true;
    if (!isNaN(value) && value.toString().indexOf(".") != -1) {
      return true;
    }
    return false;
  };

  const validateForm = () => {
    var isFormValid = true;
    if (!validateFloat(servicePrice)) isFormValid = false;
    useds.map((supply) => { 
      if (!validateFloat(supply.price)) isFormValid = false; });
    examinations.map((exam) => { 
      if (!validateFloat(exam.price)) isFormValid = false; });
    operations.map((operation) => { 
      if (!validateFloat(operation.price)) isFormValid = false; });
    return isFormValid;
  };

  const createBill = () => {
    const parsedUseds = useds.map((x) => ({
      ...x,
      price: parseFloat(x.price),
    }));
    const parsedExaminations = examinations.map((x) => ({
      ...x,
      price: parseFloat(x.price),
    }));
    const parsedOperations = operations.map((x) => ({
      ...x,
      price: parseFloat(x.price),
    }));
    let formattedDate = "";
    if (duedate) {
      if (duedate.hasOwnProperty("$d")) {
        const date = duedate.$d;
        formattedDate =
          date.getFullYear() +
          "-" +
          ("0" + (date.getMonth() + 1)).slice(-2) +
          "-" +
          ("0" + date.getDate()).slice(-2);
      } else {
        const date = duedate;
        formattedDate =
          date.getFullYear() +
          "-" +
          ("0" + (date.getMonth() + 1)).slice(-2) +
          "-" +
          ("0" + date.getDate()).slice(-2);
      }
    }

    const newBillObject = {
      appointment_id: appointments.singleAppointment.id,
      due_date: formattedDate + "T00:00:00",
      service_price: parseFloat(servicePrice),
      supplies: parsedUseds,
      examinations: parsedExaminations.concat(parsedOperations),
    };
    dispatch(newBill(newBillObject));
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography sx={{ color: "white", fontSize: 25 }}>Lasku</Typography>
      <Box sx={{ width: "100%" }}>
        <Box
          sx={{
            color: "white",
            flexDirection: "row",
            display: "flex",
            justifyContent: "space-between",

            alignItems: "center",
          }}
        >
          <Box sx={{ width: "80%" }}>
            <Typography noWrap>Käyntimaksu</Typography>
          </Box>

          <TextField
            id="outlined-basic"
            onChange={(e) => {
              setServicePrice(e.target.value);
            }}
            value={servicePrice}
            label="Hinta (€)"
            variant="filled"
            type="number"
            sx={{ backgroundColor: "white", borderRadius: 1, width: "20%" }}
            error={!validateFloat(servicePrice)}
          />
        </Box>
        {examinations.map((examination, index) => (
          <Box
            key={index}
            sx={{
              color: "white",
              flexDirection: "row",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ width: "80%" }}>
              <Typography noWrap>{examination.name}</Typography>
            </Box>
            <TextField
              id="outlined-basic"
              onChange={(e) => {
                changeExaminationsPrice(e, examination.examination_type_id);
              }}
              value={examination.price}
              label="Hinta (€)"
              variant="filled"
              type="number"
              sx={{ backgroundColor: "white", borderRadius: 1, width: "20%" }}
              error={!validateFloat(examination.price)}
            />
          </Box>
        ))}
        {operations.map((operation, index) => (
          <Box
            key={index}
            sx={{
              color: "white",
              flexDirection: "row",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ width: "80%" }}>
              <Typography noWrap>{operation.name}</Typography>
            </Box>
            <TextField
              value={operation.price}
              onChange={(e) => {
                changeOperationsPrice(e, operation.examination_type_id);
              }}
              id="outlined-basic"
              label="Hinta (€)"
              variant="filled"
              type="number"
              sx={{ backgroundColor: "white", borderRadius: 1, width: "20%" }}
              error={!validateFloat(operation.price)}
            />
          </Box>
        ))}
        {useds.map((supply, index) => (
          <Box
            key={index}
            sx={{
              color: "white",
              flexDirection: "row",
              display: "flex",
              justifyContent: "space-between",

              alignItems: "center",
            }}
          >
            <Box sx={{ width: "60%" }}>
              <Typography>{supply.name}</Typography>
            </Box>
            <Box sx={{ width: "20%" }}>
              <Typography noWrap>
                {supply.amount} {displaySupplyUnit(supply.unit)}
              </Typography>
            </Box>
            <TextField
              value={supply.price}
              onChange={(e) => {
                changeUsedsPrice(e, supply.supplies_id);
              }}
              id="outlined-basic"
              label="Hinta kpl (€)"
              variant="filled"
              type="number"
              sx={{ backgroundColor: "white", borderRadius: 1, width: "20%" }}
              error={!validateFloat(supply.price)}
            />
          </Box>
        ))}
        <Divider sx={{ my: 2, bgcolor: "white" }} />
        <Box
          sx={{
            color: "white",
            flexDirection: "row",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>Yhteensä:</Box>
          <Box>{calcTotal()} €</Box>
        </Box>
        <Box sx={{ marginTop: 2 }}>
          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale="fi"
            fullWidth
          >
            <DatePicker
              fullWidth
              id="duedate"
              label="Eräpäivä"
              value={duedate}
              required
              onChange={(newValue) => {
                setDuedate(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  variant="filled"
                  sx={{
                    backgroundColor: "white",
                    borderRadius: 1,
                  }}
                  fullWidth
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
          </LocalizationProvider>
        </Box>

        <Box sx={{ marginTop: 5 }}>
          <Button
            type="submit"
            startIcon={<AddIcon />}
            variant="contained"
            size="large"
            color="success"
            disabled={isNaN(parseFloat(calcTotal())) || !validateForm() || !isDateValid()}
            sx={{ ml: 3 }}
            onClick={() => {
              createBill();
            }}
          >
            Luo lasku
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
export default NewBill;
