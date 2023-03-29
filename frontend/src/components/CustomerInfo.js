import {
  Alert,
  Button,
  Card,
  CardHeader,
  Collapse,
  Divider,
  Grid,
  Snackbar,
  TextField,
  Typography,
  Paper,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "@mui/material";
import { Box, Container } from "@mui/system";
import ClearIcon from "@mui/icons-material/Clear";
import CheckIcon from "@mui/icons-material/Check";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import PatientInfo from "./PatientInfo";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { fetchCustomer, updateCustomer, deleteCustomer } from "../store/features/customerSlice";
import { fetchPatients } from "../store/features/patientsSlice";
import { useDispatch } from "react-redux";
import CreatePatient from "./CreatePatient";
import { fetchCustomerAppointments } from "../store/features/appointmentsSlice";
import { fetchAppointmenttypes } from "../store/features/appointmenttypesSlice";

export default function CustomerInfo() {
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [postnum, setPostnum] = useState("");
  const [city, setCity] = useState("");
  const [disable, setDisable] = useState(true);
  const customer = useSelector((state) => state.customer);
  const patients = useSelector((state) => state.patients);
  const appointments = useSelector((state) => state.appointments);
  const [createPatientOpen, setCreatePatientOpen] = useState(false);
  const [oldAppointmentOpen, setOldAppointmentOpen] = useState(false);
  const appointmenttypes = useSelector((state) => state.appointmenttypes);

  useEffect(() => {
    if (customer.customer.id != params.id) {
      dispatch(fetchCustomer(params.id));
      dispatch(fetchCustomerAppointments(params.id));
    } else {
      dispatch(fetchPatients(params.id));
      dispatch(fetchCustomerAppointments(params.id));
      setFirstname(customer.customer.first_name);
      setLastname(customer.customer.last_name);
      setEmail(customer.customer.email.String);
      setPhone(customer.customer.phone_number.String);
      setAddress(customer.customer.street_address.String);
      setPostnum(customer.customer.zip_code.String);
      setCity(customer.customer.municipality.String);
    }
  }, [customer.customer]);

  useEffect(() => {
    setCreatePatientOpen(false);
  }, [patients.patients]);

  useEffect(() => {}, [patients.patients]);

  const hideCreatePatient = () => {
    setCreatePatientOpen(false);
  };

  useEffect(() => {
    dispatch(fetchAppointmenttypes())
  }, []);

  const isDirty = () => {
    return (
      firstname === customer.customer.first_name &&
      lastname === customer.customer.last_name &&
      email === customer.customer.email.String &&
      phone === customer.customer.phone_number.String &&
      address === customer.customer.street_address.String &&
      postnum === customer.customer.zip_code.String &&
      city === customer.customer.municipality.String
    );
  };

  const resetFields = () => {
    setFirstname(customer.customer.first_name);
    setLastname(customer.customer.last_name);
    setEmail(customer.customer.email.String);
    setPhone(customer.customer.phone_number.String);
    setAddress(customer.customer.street_address.String);
    setPostnum(customer.customer.zip_code.String);
    setCity(customer.customer.municipality.String);
  };

  const handleCustomerUpdate = () => {
    const customerObject = {
      email: email,
      first_name: firstname,
      last_name: lastname,
      municipality: city,
      phone_number: phone,
      street_address: address,
      zip_code: postnum,
      id: customer.customer.id,
    };
    dispatch(updateCustomer(customerObject, navigate));
  };

  const formatDate = (unformattedDate) => {
    const date = new Date(unformattedDate);
    return (
      ("0" + date.getDate()).slice(-2) +
      "." +
      ("0" + (date.getMonth() + 1)).slice(-2) +
      "." +
      date.getFullYear() +
      " " +
      ("0" + date.getHours()).slice(-2) +
      ":" +
      ("0" + date.getMinutes()).slice(-2)
    );
  };

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    dispatch(deleteCustomer(customer.customer.id, navigate))
  }

  return (
    <>
      <Grid
        container
        spacing={1}
        gap={1}
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          backgroundColor: "primary",
          paddingX: 1,
          paddingTop: 1,
          paddingBottom: 1,
          mt: 5,
        }}
      >
        <Grid item xs={12} sm={7} md={9} lg={9} xl={9}>
          <Container
            sx={{
              backgroundColor: "secondary.main",

              padding: 5,
              paddingX: 5,
              paddingTop: 4,
              paddingBottom: 4,
              borderRadius: "1%",
              boxShadow: 22,
            }}
            component="main"
            maxWidth="sm"
            display="flex"
            //justifyContent="flex-end"
          >
            <Snackbar anchorOrigin={{ vertical: "top", horizontal: "center" }}>
              <Alert severity="error" sx={{ justifyContent: "center" }}></Alert>
            </Snackbar>

            <Box>
              {customer.error === "customer not found" ? (
                <Typography variant="h5" color="white">
                  Asiakasta ei löytynyt
                </Typography>
              ) : (
                <>
                <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                  <Typography variant="h5" color="white">
                    Asiakkaan tiedot
                  </Typography>
                  <IconButton
                    id="deleteCustomer"
                    sx={{color:"white"}}
                    size="large"
                    onClick={handleClickOpen}
                  >
                    <DeleteOutlineIcon />
                  </IconButton>
                  <Dialog
                    open={open}
                    onClose={handleClose}
                    PaperComponent={({ children }) => (
                      <Paper style={{ background: "white" }}>{children}</Paper>
                    )}
                  >
                    <DialogTitle>
                      {"Haluatko varmasti poistaa asiakkaan?"}
                    </DialogTitle>
                    <DialogContent>
                      <DialogContentText>
                        Kaikki asiakkaan tiedot poistetaan. 
                        Tätä toimintoa ei voi kumota.
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button 
                        variant="contained"
                        onClick={handleClose}
                        color="info"
                        >
                        Peruuta
                      </Button>
                      <Button 
                        variant="contained"
                        onClick={handleDelete} 
                        color="warning"
                        >
                        Vahvista
                      </Button>
                    </DialogActions>
                  </Dialog>
                  </Box>
                  <Box>
                    <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="info_firstname"
                        label="Etunimi"
                        name="firstname"
                        value={firstname}
                        onChange={(e) => {
                          setFirstname(e.target.value);
                        }}
                        variant="filled"
                        sx={{
                          backgroundColor: "white",
                          borderRadius: 1,
                        }}
                      />
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="info_lastname"
                        label="Sukunimi"
                        name="lastname"
                        value={lastname}
                        onChange={(e) => {
                          setLastname(e.target.value);
                        }}
                        variant="filled"
                        sx={{
                          backgroundColor: "white",
                          borderRadius: 1,
                        }}
                      />
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="info_email"
                        label="Sähköposti"
                        name="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                        }}
                        variant="filled"
                        sx={{
                          backgroundColor: "white",
                          borderRadius: 1,
                        }}
                      />
                      <TextField
                        margin="normal"
                        fullWidth
                        id="info_phone"
                        label="Puhelinnumero"
                        name="phone"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                        }}
                        variant="filled"
                        sx={{
                          backgroundColor: "white",
                          borderRadius: 1,
                        }}
                      />
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "row", gap: 3 }}>
                      <TextField
                        margin="normal"
                        fullWidth
                        id="info_address"
                        label="Katuosoite"
                        name="address"
                        value={address}
                        onChange={(e) => {
                          setAddress(e.target.value);
                        }}
                        variant="filled"
                        sx={{
                          backgroundColor: "white",
                          borderRadius: 1,
                        }}
                      />
                      <TextField
                        margin="normal"
                        fullWidth
                        id="info_postnum"
                        label="Postinumero"
                        name="postnum"
                        value={postnum}
                        onChange={(e) => {
                          setPostnum(e.target.value);
                        }}
                        variant="filled"
                        sx={{
                          backgroundColor: "white",
                          borderRadius: 1,
                        }}
                      />
                      <TextField
                        margin="normal"
                        fullWidth
                        id="info_city"
                        label="Paikkakunta"
                        name="city"
                        value={city}
                        onChange={(e) => {
                          setCity(e.target.value);
                        }}
                        variant="filled"
                        sx={{
                          backgroundColor: "white",
                          borderRadius: 1,
                        }}
                      />
                    </Box>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "warning.main",
                        display: disable ? "none" : "block",
                      }}
                    >
                      On tallentamattomia muutoksia
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
                      <Button
                        startIcon={<ClearIcon />}
                        onClick={() => resetFields()}
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
                        onClick={() => handleCustomerUpdate()}
                        disabled={firstname == "" || lastname == "" || email == ""}
                      >
                        Tallenna
                      </Button>
                    </Box>
                    <Divider sx={{ my: 2, bgcolor: "white" }} />
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Button
                        startIcon={<AddIcon />}
                        variant="contained"
                        color="info"
                        size="large"
                        sx={{ marginBottom: 2 }}
                        onClick={() => {
                          setCreatePatientOpen(true);
                        }}
                      >
                        Uusi potilas
                      </Button>
                    </Box>
                    <Box>
                      {createPatientOpen && (
                        <CreatePatient close={hideCreatePatient} />
                      )}
                      {patients.patients
                        .slice(0)
                        .reverse()
                        .map((patient) => (
                          <PatientInfo key={patient.id} patient={patient} />
                        ))}
                    </Box>
                  </Box>
                </>
              )}
            </Box>
          </Container>
        </Grid>
        <Grid item xs={12} sm={4} md={2} lg={2} xl={2}>
          <Box
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "right",
              paddingTop: 1,
              paddingBottom: 1,
              padding: 10,
            }}
            sx={{
              backgroundColor: "secondary.main",
            }}
          >
            <Typography variant="h6" color="white">
              Tulevat käynnit
            </Typography>
            {appointments.customerAppointments.map(
              (appointment) =>
                new Date().getTime() <
                  new Date(appointment.starting_date).getTime() && (
                  <Box key={appointment.id} paddingTop={2}>
                    <Box sx={{
                      display: "flex", 
                      flexDirection: "row",
                      justifyContent: "left",
                      gap: 1
                      }}>
                      <Typography variant="body1" color="white">
                        {formatDate(appointment.starting_date)}
                      </Typography>
                      {appointmenttypes.appointmenttypes.filter(type => 
                        type.id === appointment.appointment_type_id).map(type =>
                        <Typography key={type.id} variant="body1" color="white">
                          {type.name}
                        </Typography>
                      )}
                    </Box>
                    <Typography variant="body1" color="white">
                      Potilas: {appointment.name}
                    </Typography>
                    <Link
                      variant="body1"
                      color="white"
                      onClick={() => {
                        //console.info("I'm a button.");
                        navigate("/appointment/" + appointment.id);
                        navigate(0);
                      }}
                    >
                      Lisätietoja
                    </Link>
                  </Box>
                )
            )}
            <Divider sx={{ my: 2, bgcolor: "white" }} />
            <Box>
              <Card
                sx={{
                  backgroundColor: "secondary.main",
                }}
              >
                <CardHeader
                  title="Menneet käynnit"
                  onClick={() => setOldAppointmentOpen(!oldAppointmentOpen)}
                  sx={{ color: "white" }}
                  titleTypographyProps={{ variant: "h6" }}
                  action={
                    <IconButton sx={{color: "white"}}>
                      <ExpandMoreIcon />
                    </IconButton>
                  }
                />
                <Collapse in={oldAppointmentOpen} sx={{ paddingX: 2 }}>
                  {appointments.customerAppointments.map(
                    (appointment) =>
                      new Date().getTime() >
                        new Date(appointment.starting_date).getTime() && (
                        <Box
                          key={appointment.id}
                          paddingTop={1}
                          paddingBottom={1}
                        >
                          <Box sx={{
                            display: "flex", 
                            flexDirection: "row",
                            justifyContent: "left",
                            gap: 1
                            }}>
                            <Typography variant="body1" color="white">
                              {formatDate(appointment.starting_date)}
                            </Typography>
                            {appointmenttypes.appointmenttypes.filter(type => 
                              type.id === appointment.appointment_type_id).map(type =>
                              <Typography key={type.id} variant="body1" color="white">
                                {type.name}
                              </Typography>
                            )}
                          </Box>
                          <Typography variant="body1" color="white">
                            Potilas: {appointment.name}
                          </Typography>
                          <Link
                            variant="body1"
                            color="white"
                            onClick={() => {
                              //console.info("I'm a button.");
                              navigate("/appointment/" + appointment.id);
                              navigate(0);
                            }}
                          >
                            Lisätietoja
                          </Link>
                        </Box>
                      )
                  )}
                </Collapse>
              </Card>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
