import {
  Alert,
  Button,
  Snackbar,
  TextField,
  Typography,
  Divider,
} from "@mui/material";
import { Box, Container } from "@mui/system";
import ClearIcon from "@mui/icons-material/Clear";
import CheckIcon from "@mui/icons-material/Check";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  createCustomer,
  setErrorMessage,
} from "../store/features/customerSlice";
import { useDispatch, useSelector } from "react-redux";

export default function CreateCustomer() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [nni, setNni] = useState("");
  const [address, setAddress] = useState("");
  const [postnum, setPostnum] = useState("");
  const [city, setCity] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const customer = useSelector((state) => state.customer);

  const validateForm = () => {
    return firstname.length > 0 && lastname.length > 0 && email.length > 0;
  };

  const handleSave = () => {
    const customerObject = {
      email: email,
      first_name: firstname,
      last_name: lastname,
      municipality: city,
      phone_number: phone,
      ssn: nni,
      street_address: address,
      zip_code: postnum,
    };
    dispatch(createCustomer(customerObject, navigate));
  };
  const closeError = () => {
    dispatch(setErrorMessage(""));
  };
  useEffect(() => {
    dispatch(setErrorMessage(""));
  }, []);

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
        "@media (min-width: 600px)": 
          {
            marginBottom: 2
          }
      }}
      component="main"
      maxWidth="sm"
    >
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={customer.error !== ""}
        autoHideDuration={6000}
        onClose={closeError}
      >
        <Alert severity="error" sx={{ justifyContent: "center" }}>
          {customer.error}
        </Alert>
      </Snackbar>

      <Box>
        <Typography variant="h5" color="white">
          Uuden asiakkuuden luominen
        </Typography>
        <Box>
          <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="add_firstname"
              label="Etunimi"
              name="firstname"
              autoFocus
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
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
              id="add_lastname"
              label="Sukunimi"
              name="lastname"
              autoFocus
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              variant="filled"
              sx={{
                backgroundColor: "white",
                borderRadius: 1,
              }}
            />
          </Box>
          <TextField
            margin="normal"
            required
            fullWidth
            id="add_email"
            label="Sähköposti"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="filled"
            sx={{
              backgroundColor: "white",
              borderRadius: 1,
            }}
          />
          <Divider sx={{ my: 2, bgcolor: "white" }} />
          <TextField
            margin="normal"
            fullWidth
            id="add_phone"
            label="Puhelinnumero"
            name="phone"
            autoFocus
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            variant="filled"
            sx={{
              backgroundColor: "white",
              borderRadius: 1,
            }}
          />
          <TextField
            margin="normal"
            fullWidth
            id="add_nni"
            label="Henkilötunnus"
            name="nni"
            autoFocus
            value={nni}
            onChange={(e) => setNni(e.target.value)}
            variant="filled"
            sx={{
              backgroundColor: "white",
              borderRadius: 1,
            }}
          />
          <TextField
            margin="normal"
            fullWidth
            id="add_address"
            label="Katuosoite"
            name="address"
            autoFocus
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            variant="filled"
            sx={{
              backgroundColor: "white",
              borderRadius: 1,
            }}
          />
          <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
            <TextField
              margin="normal"
              fullWidth
              id="add_postnum"
              label="Postinumero"
              name="postnum"
              autoFocus
              value={postnum}
              onChange={(e) => setPostnum(e.target.value)}
              variant="filled"
              sx={{
                backgroundColor: "white",
                borderRadius: 1,
              }}
            />
            <TextField
              margin="normal"
              fullWidth
              id="add_city"
              label="Paikkakunta"
              name="city"
              autoFocus
              value={city}
              onChange={(e) => setCity(e.target.value)}
              variant="filled"
              sx={{
                backgroundColor: "white",
                borderRadius: 1,
              }}
            />
          </Box>
          <Divider sx={{ my: 2, bgcolor: "white" }} />
          <Box 
            sx={{ 
              "@media (max-width: 380px)": 
                {
                  display: "flex", 
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2
                }
              }}
            >
            <Button
              startIcon={<ClearIcon />}
              onClick={() => navigate(-1)}
              size="large"
              variant="contained"
              color="error"
              sx={{ 
                "@media (max-width: 380px)": 
                  {
                    width: "150px !important",
                    padding: "8px 22px"
                  }
                }}
            >
              Peruuta
            </Button>
            <Button
              type="submit"
              startIcon={<CheckIcon />}
              disabled={!validateForm()}
              variant="contained"
              size="large"
              sx={{
                "@media (min-width: 380px)": 
                {
                  ml: 3
                },
                "@media (max-width: 380px)": 
                  {
                    ml: 0,
                    width: "150px !important",
                    padding: "8px 22px"
                  }
                }}
              color="success"
              onClick={() => {
                handleSave();
              }}
            >
              Tallenna
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
