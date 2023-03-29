import {
  Grid,
  TextField,
  Button,
  Typography,
  Paper,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import CheckIcon from "@mui/icons-material/Check";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import React, { useState, useEffect } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import "dayjs/locale/fi";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ListSubheader from "@mui/material/ListSubheader";
import { useDispatch } from "react-redux";
import { updatePatient, deletePatient } from "../store/features/patientsSlice";
import { useSelector } from "react-redux";
import { deleteAppointment } from "../store/features/appointmentsSlice";

const PatientInfo = ({ patient }) => {
  const species = useSelector((state) => state.species);
  const dispatch = useDispatch();
  const [birthdate, setBirthdate] = useState(null);
  const [sex, setSex] = useState("");
  const [name, setName] = useState("");
  const [breed, setBreed] = useState("");
  const [mchip, setMchip] = useState("");
  const [weight, setWeight] = useState("");

  useEffect(() => {
    setName(patient.name);
    setSex(patient.sex);
    const date = new Date(patient.dateOfBirth.String);
    patient.dateOfBirth.String == "" ? setBirthdate(null) : setBirthdate(date);
    setBreed(patient.breedId);
    setMchip(patient.microchip.String);
    setWeight(patient.weight.Int64);
  }, []);

  const resetFields = () => {
    setName(patient.name);
    setSex(patient.sex);
    const date = new Date(patient.dateOfBirth.String);
    patient.dateOfBirth.String == "" ? setBirthdate(null) : setBirthdate(date);
    setBreed(patient.breedId);
    setMchip(patient.microchip.String);
    setWeight(patient.weight.Int64);
  };

  const isDirty = () => {
    let isDateDirty = true;

    if (birthdate) {
      if (birthdate.hasOwnProperty("$d")) {
        const date = birthdate.$d;
        const formattedDate =
          date.getFullYear() +
          "-" +
          ("0" + (date.getMonth() + 1)).slice(-2) +
          "-" +
          ("0" + date.getDate()).slice(-2);
        isDateDirty = formattedDate == patient.dateOfBirth.String;
      } else {
        const date = birthdate;
        const formattedDate =
          date.getFullYear() +
          "-" +
          ("0" + (date.getMonth() + 1)).slice(-2) +
          "-" +
          ("0" + date.getDate()).slice(-2);
        isDateDirty = formattedDate == patient.dateOfBirth.String;
      }
    } else {
      isDateDirty = patient.dateOfBirth.String == "";
    }
    const formState =
      name === patient.name &&
      sex === patient.sex &&
      breed === patient.breedId &&
      mchip === patient.microchip.String &&
      weight == patient.weight.Int64 &&
      isDateDirty;
    return !formState;
  };

  const handleSexChange = (event) => {
    setSex(event.target.value);
  };

  const handleBreedChange = (event) => {
    setBreed(event.target.value);
  };

  const handleSave = () => {
    let formattedDate = "";
    if (birthdate) {
      if (birthdate.hasOwnProperty("$d")) {
        const date = birthdate.$d;
        formattedDate =
          date.getFullYear() +
          "-" +
          ("0" + (date.getMonth() + 1)).slice(-2) +
          "-" +
          ("0" + date.getDate()).slice(-2);
      } else {
        const date = birthdate;
        formattedDate =
          date.getFullYear() +
          "-" +
          ("0" + (date.getMonth() + 1)).slice(-2) +
          "-" +
          ("0" + date.getDate()).slice(-2);
      }
    }
    const patientObject = {
      breedId: breed,
      customerId: patient.customerId,
      dateOfBirth: formattedDate,
      name: name,
      sex: sex,
      id: patient.id,
      microchip: mchip,
      weight: parseInt(weight_kg * 1000),
    };
    dispatch(updatePatient(patientObject));
  };

  const isDateValid = () => {
    if (birthdate) {
      if (birthdate instanceof Date && !isNaN(birthdate.valueOf())) {
        return true;
      } else if (birthdate.hasOwnProperty("$d")) {
        if (birthdate.$d instanceof Date && !isNaN(birthdate.valueOf())) {
          return true;
        } else return false;
      }
    } else {
      return true;
    }
  };

  const renderSelectGroup = (specie) => {
    const items = specie.Breeds
      ? specie.Breeds.map((breed) => {
          return (
            <MenuItem key={breed.id} value={breed.id}>
              {breed.name}
            </MenuItem>
          );
        })
      : [];

    return [
      <ListSubheader
        sx={{
          backgroundColor: "#f0f0f0",
        }}
      >
        {specie.name}
      </ListSubheader>,
      items,
    ];
  };

  const isWeightValid = () => {
    if (parseFloat(weight) == NaN || weight <= 0) return false;
    return true;
  };

  const weight_kg = weight / 1000;

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const customerAppointments = useSelector(
    (state) => state.appointments.customerAppointments
  );

  const handleDelete = () => {
    customerAppointments
      .filter((appointment) => appointment.patientId === patient.id)
      .map((appointment) => {
        return dispatch(deleteAppointment(appointment));
      });
    dispatch(deletePatient(patient.id, patient.customerId));
  };

  return (
    <Accordion
      sx={{
        backgroundColor: "primary.main",
        marginTop: 1,
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{
          borderBottomWidth: 2,
          borderColor: "red",
          borderWidth: 2,
        }}
      >
        <Typography align="center" sx={{ width: "100%", color: "white" }}>
          {patient.name}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid>
          <Grid
            container
            sx={{
              justifyContent: "center",
              display: "flex",
              flexDirection: "row",
            }}
          >
            <Grid
              item
              sx={{
                margin: 1,
                width: 230,
              }}
            >
              <TextField
                fullWidth
                id="patient_name"
                label="Nimi"
                required
                variant="filled"
                sx={{
                  backgroundColor: "white",
                  borderRadius: 1,
                }}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </Grid>
            <Grid
              item
              sx={{
                margin: 1,
                width: 230,
              }}
            >
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale="fi"
                fullWidth
              >
                <DatePicker
                  fullWidth
                  id="patient_birthdate"
                  label="Syntymäaika"
                  value={birthdate}
                  onChange={(newValue) => {
                    setBirthdate(newValue);
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
                  maxDate={new Date()}
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
            </Grid>
          </Grid>
          <Grid
            container
            sx={{
              justifyContent: "center",
              display: "flex",
              flexDirection: "row",
            }}
          >
            <Grid
              item
              sx={{
                margin: 1,
                width: 230,
              }}
            >
              <FormControl fullWidth>
                <InputLabel variant="filled" required>
                  Sukupuoli
                </InputLabel>
                <Select
                  variant="filled"
                  value={sex}
                  onChange={handleSexChange}
                  id="patient_sex"
                  label="Sukupuoli"
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
                  <MenuItem value="male">Uros</MenuItem>
                  <MenuItem value="female">Naaras</MenuItem>
                  <MenuItem value="sterilizedFemale">
                    Sterilisoitu naaras
                  </MenuItem>
                  <MenuItem value="castratedMale">Kastroitu uros</MenuItem>
                  <MenuItem value="unknown">Ei tiedossa</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid
              item
              sx={{
                margin: 1,
                width: 230,
              }}
            >
              <FormControl fullWidth>
                <InputLabel variant="filled" required>
                  Laji
                </InputLabel>
                <Select
                  variant="filled"
                  value={breed}
                  onChange={handleBreedChange}
                  id="patient_species"
                  label="Laji"
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
                  {species.species.map((specie) => renderSelectGroup(specie))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Grid
            container
            sx={{
              justifyContent: "center",
              display: "flex",
              flexDirection: "row",
            }}
          >
            <Grid
              item
              sx={{
                margin: 1,
                width: 230,
              }}
            >
              <TextField
                fullWidth
                id="patient_mchip"
                label="Mikrosiru"
                variant="filled"
                sx={{
                  backgroundColor: "white",
                  borderRadius: 1,
                }}
                value={mchip}
                onChange={(e) => {
                  setMchip(e.target.value);
                }}
              />
            </Grid>
            <Grid
              item
              sx={{
                margin: 1,
                width: 230,
              }}
            >
              <TextField
                fullWidth
                id="patient_weight"
                label="Paino (kg)"
                variant="filled"
                type="number"
                step="0.001"
                sx={{
                  backgroundColor: "white",
                  borderRadius: 1,
                }}
                value={Number(weight_kg).toString()}
                error={!isWeightValid()}
                helperText={
                  !isWeightValid() ? "Käytä pilkkua desimaalierottimena" : ""
                }
                onChange={(e) => {
                  setWeight(e.target.value * 1000);
                }}
              />
            </Grid>
          </Grid>
          <Grid
            container
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
              marginTop: 1,
            }}
          >
            <Grid
              container
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <Grid item>
                <Button
                  startIcon={<ClearIcon />}
                  size="large"
                  variant="contained"
                  color="error"
                  onClick={() => resetFields()}
                  sx={{
                    width: 150,
                    marginBottom: 2,
                    marginX: 1,
                  }}
                  disabled={!isDirty()}
                >
                  Peruuta
                </Button>
              </Grid>
              <Grid item>
                <Button
                  type="submit"
                  startIcon={<CheckIcon />}
                  variant="contained"
                  size="large"
                  color="success"
                  sx={{
                    width: 150,
                    marginBottom: 2,
                    marginX: 1,
                  }}
                  disabled={
                    !isDirty() ||
                    !isDateValid() ||
                    breed == "" ||
                    name == "" ||
                    sex == ""
                  }
                  onClick={() => handleSave()}
                >
                  Tallenna
                </Button>
              </Grid>
            </Grid>
            <Grid item>
              <IconButton
                id="deletePatient"
                sx={{
                  color: "white",
                  marginX: 2,
                }}
                size="large"
                onClick={handleClickOpen}
              >
                <DeleteOutlineIcon />
              </IconButton>
            </Grid>
            <Dialog
              open={open}
              onClose={handleClose}
              PaperComponent={({ children }) => (
                <Paper style={{ background: "white" }}>{children}</Paper>
              )}
            >
              <DialogTitle>{"Haluatko varmasti poistaa potilaan?"}</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Kaikki potilaan tiedot poistetaan. Tätä toimintoa ei voi
                  kumota.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button variant="contained" onClick={handleClose} color="info">
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
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export default PatientInfo;
