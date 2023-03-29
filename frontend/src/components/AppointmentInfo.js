import {
  Button,
  Divider,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  Typography,
} from "@mui/material";
import { Box, Container } from "@mui/system";
import { useState, useEffect } from "react";
import ClearIcon from "@mui/icons-material/Clear";
import CheckIcon from "@mui/icons-material/Check";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchAppointments,
  fetchSingleAppointment,
  billedAppointment,
} from "../store/features/appointmentsSlice";
import Prerequisities from "./appointmentComponents/Prerequisities";
import Status from "./appointmentComponents/Status";
import Measurement from "./appointmentComponents/Measurement";
import Diagnosis from "./appointmentComponents/Diagnosis";
import Operations from "./appointmentComponents/Operations";
import Supplies from "./appointmentComponents/Supplies";
import Report from "./appointmentComponents/Report";
import Medicine from "./appointmentComponents/Medicine";
import Schedule from "./appointmentComponents/Schedule";
import Type from "./appointmentComponents/Type";
import { fetchBill } from "../store/features/billSlice";
import Bill from "./appointmentComponents/Bill";

export default function AppointmentInfo() {
  const [prerequisityopen, setPrerequisityopen] = useState(false);
  const [currentopen, setCurrentopen] = useState(false);
  const [measurementopen, setMeasurementopen] = useState(false);
  const [diagnoseopen, setDiagnoseopen] = useState(false);
  const [measureopen, setMeasureopen] = useState(false);
  const [supplyopen, setSupplyopen] = useState(false);
  const [mediopen, setMediopen] = useState(false);
  const [reportopen, setReportopen] = useState(false);
  const [cardsOpen, setCardsOpen] = useState(false);
  const bill = useSelector((state) => state.bill.singleBill);

  const params = useParams();
  const dispatch = useDispatch();
  const appointments = useSelector((state) => state.appointments);
  const navigate = useNavigate();

  useEffect(() => {
    if (appointments.singleAppointment.id != params.id) {
      dispatch(fetchSingleAppointment(params.id));
      dispatch(fetchBill(params.id));
    } else {
    }
  }, [appointments.singleAppointment]);

  useEffect(() => {
    dispatch(fetchAppointments);
  }, []);

  const handlePrint = () => {
    navigate(`/invoice`);
  };

  const handleShowCustomer = () => {
    navigate(`/customer/${appointments.singleAppointment.customer_id}`);
  };

  const handleOpenClose = () => {
    if (cardsOpen) {
      setPrerequisityopen(false);
      setCurrentopen(false);
      setMeasurementopen(false);
      setDiagnoseopen(false);
      setMeasureopen(false);
      setSupplyopen(false);
      setMediopen(false);
      setReportopen(false);
    } else {
      setPrerequisityopen(true);
      setCurrentopen(true);
      setMeasurementopen(true);
      setDiagnoseopen(true);
      setMeasureopen(true);
      setSupplyopen(true);
      setMediopen(true);
      setReportopen(true);
    }
    setCardsOpen(!cardsOpen);
  };

  const calcAge = (birthday) => {
    if (birthday != "") {
      var ageDifMs = Date.now() - new Date(birthday);
      var ageDate = new Date(ageDifMs); // miliseconds from epoch
      return Math.abs(ageDate.getUTCFullYear() - 1970) + " vuotta";
    } else {
      return "-";
    }
  };

  const getSex = () => {
    switch (appointments.singleAppointment.sex) {
      case "male":
        return "Uros";
      case "female":
        return "Naaras";
      case "sterilizedFemale":
        return "Sterilisoitu naaras";
      case "castratedMale":
        return "Kastroitu uros";
      case "unknown":
        return "Ei tiedossa";
      default:
        return "";
    }
  };

  return (
    <Container
      sx={{
        backgroundColor: "secondary.main",
        mt: 5,
        padding: 5,
        paddingX: 5,
        paddingTop: 4,
        paddingBottom: 4,
        borderRadius: "1%",
        boxShadow: 22,
        marginBottom: 5,
      }}
      component="main"
      maxWidth="sm"
    >
      <Box>
        <Typography variant="h5" color="white" sx={{ marginBottom: 2 }}>
          Käynnin tiedot
        </Typography>
        <Box>
          <Box>
            <Box sx={{ display: "flex", flexDirection: "row", gap: 6 }}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Typography variant="h7" color="white">
                  Potilas: {appointments.singleAppointment.name}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Typography variant="h7" color="white">
                  Ikä:{" "}
                  {calcAge(appointments.singleAppointment.date_of_birth.String)}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Typography variant="h7" color="white">
                  Sukupuoli: {getSex()}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "row", gap: 3 }}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Typography variant="h7" color="white">
                  Päivämäärä:{" "}
                  {(
                    "0" +
                    new Date(
                      appointments.singleAppointment.starting_date
                    ).getDate()
                  ).slice(-2) +
                    "." +
                    (
                      "0" +
                      (new Date(
                        appointments.singleAppointment.starting_date
                      ).getMonth() +
                        1)
                    ).slice(-2) +
                    "." +
                    new Date(
                      appointments.singleAppointment.starting_date
                    ).getFullYear()}
                </Typography>
                <Typography variant="body1"></Typography>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Typography variant="h7" color="white">
                  Kellonaika:{" "}
                  {(
                    "0" +
                    new Date(
                      appointments.singleAppointment.starting_date
                    ).getHours()
                  ).slice(-2) +
                    ":" +
                    (
                      "0" +
                      new Date(
                        appointments.singleAppointment.starting_date
                      ).getMinutes()
                    ).slice(-2)}
                </Typography>
                <Typography variant="body1"></Typography>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Typography variant="h7" color="white">
                  Kesto:{" "}
                  {Math.floor(
                    (new Date(
                      appointments.singleAppointment.ending_date.String
                    ) -
                      new Date(appointments.singleAppointment.starting_date)) /
                      1000 /
                      60
                  )}{" "}
                  min
                </Typography>
                <Typography variant="body1"></Typography>
              </Box>
            </Box>
            <Button
              onClick={handleShowCustomer}
              size="small"
              variant="contained"
              color="info"
            >
              Näytä asiakkaan tiedot
            </Button>
          </Box>
          <Divider sx={{ my: 2, bgcolor: "white" }} />
          <Schedule></Schedule>
          <Divider sx={{ my: 2, bgcolor: "white" }} />
          <Type></Type>
          <Divider sx={{ my: 2, bgcolor: "white" }} />
          <Box>
            <Button
              onClick={handleOpenClose}
              sx={{ backgroundColor: "#5E5BFF", color: "white" }}
              fullWidth
            >
              Näytä / piilota kaikki
            </Button>
          </Box>
          <Divider sx={{ my: 2, bgcolor: "white" }} />
          <Prerequisities open={prerequisityopen}></Prerequisities>
          <Divider sx={{ my: 2, bgcolor: "white" }} />
          <Status open={currentopen} />
          <Divider sx={{ my: 2, bgcolor: "white" }} />
          <Measurement open={measurementopen}></Measurement>
          <Divider sx={{ my: 2, bgcolor: "white" }} />
          <Diagnosis open={diagnoseopen}></Diagnosis>
          <Divider sx={{ my: 2, bgcolor: "white" }} />
          <Operations open={measureopen}></Operations>
          <Divider sx={{ my: 2, bgcolor: "white" }} />
          <Supplies open={supplyopen}></Supplies>
          <Divider sx={{ my: 2, bgcolor: "white" }} />
          <Medicine open={mediopen}></Medicine>
          <Divider sx={{ my: 2, bgcolor: "white" }} />
          <Report open={reportopen}></Report>
          <Divider sx={{ my: 2, bgcolor: "white" }} />
          <Bill />
        </Box>
      </Box>
    </Container>
  );
}
