import { Grid, TextField, Button, Typography, Box } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import CheckIcon from "@mui/icons-material/Check";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import "dayjs/locale/fi";
import ListSubheader from "@mui/material/ListSubheader";
import { useSelector, useDispatch } from "react-redux";
import { createPatient } from "../store/features/patientsSlice";

const CreatePatient = ({ close }) => {
  const customer = useSelector((state) => state.customer);
  const species = useSelector((state) => state.species);
  const dispatch = useDispatch();
  const [birthdate, setBirthdate] = useState(null);

  const [sex, setSex] = useState("");
  const [name, setName] = useState("");
  const [breed, setBreed] = useState("");
  const [mchip, setMchip] = useState("");
  const [weight, setWeight] = useState("");

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
      customerId: customer.customer.id,
      name: name,
      sex: sex,
      dateOfBirth: formattedDate,
      weight: parseInt(weight),
      microchip: mchip,
    };
    dispatch(createPatient(patientObject));
  };

  const isDateValid = () => {
    if (birthdate == null) return true;
    if (birthdate) {
      if (birthdate.$d != "Invalid Date") return true;
      return false;
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

  const weight_kg = weight / 1000;

  const isWeightValid = () => {
    if (parseFloat(weight) == NaN || weight <= 0) return false;
    return true;
  };

  return (
    <Box
      sx={{
        backgroundColor: "primary.main",
        boxShadow: 2,
        borderRadius: 1,
      }}
    >
      <Box
        sx={{
          borderWidth: 2,
        }}
      >
        <Typography
          align="center"
          sx={{ width: "100%", color: "white", padding: 1 }}
        >
          Luo uusi potilas
        </Typography>
      </Box>
      <Box>
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
              justifyContent: "center",
              marginTop: 1,
            }}
          >
            <Grid item>
              <Button
                startIcon={<ClearIcon />}
                size="large"
                variant="contained"
                color="error"
                sx={{
                  marginX: 1,
                  width: 150,
                  marginBottom: 2,
                }}
                onClick={close}
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
                  marginX: 1,
                  width: 150,
                  marginBottom: 2,
                }}
                disabled={
                  !isDateValid() || breed == "" || name == "" || sex == ""
                }
                onClick={() => handleSave()}
              >
                Tallenna
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default CreatePatient;
