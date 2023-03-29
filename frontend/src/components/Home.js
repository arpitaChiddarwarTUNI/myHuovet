import { Button, Grid } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import AppointmentCalendar from "./AppointmentCalendar";
import { useEffect } from "react";
import SearchCustomer from "./SearchCustomer";
import { fetchAppointments } from "../store/features/appointmentsSlice";
import { useDispatch } from "react-redux";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchAppointments());
  }, []);

  return (
    <>
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        padding={4}
      >
        <Grid
          container
          spacing={1}
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "stretch",
            backgroundColor: "primary",
            paddingX: 1,
            paddingTop: 1,
            paddingBottom: 1,
          }}
        >
          <Grid item xs={12} sm={8} md={6} lg={6} xl={4}>
            <SearchCustomer />
          </Grid>

          <Grid
            item
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "right",
              paddingTop: 1,
              paddingBottom: 1,
            }}
          >
            <Grid item>
              <Button
                id="newCustomerButton"
                variant="contained"
                color="secondary"
                size="large"
                startIcon={<AddIcon />}
                sx={{
                  color: "white",
                  marginY: 1,
                  minWidth: 170,
                  maxWidth: 170,
                  minHeight: 56,
                  maxHeight: 56,
                }}
                onClick={() => {
                  navigate("/new-customer");
                }}
              >
                Uusi asiakas
              </Button>
            </Grid>
            <Grid item>
              <Button
                id="newAppointmentButton"
                variant="contained"
                color="secondary"
                size="large"
                startIcon={<AddIcon />}
                sx={{
                  color: "white",
                  marginY: 1,
                  minWidth: 170,
                  maxWidth: 170,
                  minHeight: 56,
                  maxHeight: 56,
                }}
                onClick={() => {
                  navigate("/new-appointment");
                }}
              >
                Uusi käynti
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <AppointmentCalendar></AppointmentCalendar>
    </>
  );
};

export default Home;
