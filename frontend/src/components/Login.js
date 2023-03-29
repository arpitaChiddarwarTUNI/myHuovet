import React, { useState, useEffect } from "react";
import {
  Button,
  Box,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { login, logout, clearAuthError } from "../store/features/authSlice";
import { useDispatch, useSelector } from "react-redux";
import TextField from "@mui/material/TextField";
import Container from "@mui/material/Container";
import Logo from "../logo.png";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    auth.loggedIn &&
      !auth.loading &&
      !auth.loadingFromRefresh &&
      navigate("/home");
  }, [auth]);

  const validateForm = () => {
    return username.length > 0 && password.length > 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(login(username, password));
  };

  const logOutTest = async () => {
    dispatch(logout());
  };

  const closeError = () => {
    dispatch(clearAuthError());
  };
  if (auth.loadingFromRefresh) {
    return <Loading></Loading>;
  }
  if (auth.loggedIn) {
    return null;
  }

  // not logged in, show login page
  return (
    <Container component="main" maxWidth="xs">
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={auth.error !== ""}
        autoHideDuration={6000}
        onClose={closeError}
      >
        <Alert severity="error" sx={{ justifyContent: "center" }}>
          {auth.error}
        </Alert>
      </Snackbar>
      <Box
        sx={{
          marginTop: 15,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "white",
          paddingX: 5,
          paddingTop: 4,
          paddingBottom: 2,
          borderRadius: "2%",
          boxShadow: 22,
        }}
      >
        <Box component="img" sx={{ width: "50%" }} src={Logo}></Box>
        <Typography
          component="h1"
          variant="h5"
          color="secondary"
          sx={{ mt: 3 }}
        >
          Sisäänkirjautuminen
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Sähköpostiosoite"
            name="email"
            autoComplete="email"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Salasana"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            color="secondary"
            sx={{ mt: 3, mb: 2 }}
            disabled={!validateForm() || auth.loggedIn || auth.loading}
          >
            Kirjaudu sisään
          </Button>
        </Box>
        {
          <CircularProgress
            size="1.5rem"
            sx={{ mt: 1, mb: 1, opacity: auth.loading ? "100%" : "0%" }}
          ></CircularProgress>
        }
      </Box>
    </Container>
  );
}
