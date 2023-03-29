import { Stack, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
const NotFound = () => {
  const navigate = useNavigate();
  return (
    <Stack
      alignItems="center"
      sx={{
        width: "100vw",
        height: "100vh",
        justifyContent: "center",
      }}
    >
      <Typography
        variant="h1"
        sx={{
          color: "white",
        }}
      >
        404
      </Typography>
      <Typography
        variant="h4"
        sx={{
          color: "white",
        }}
      >
        Sivua ei löytynyt
      </Typography>

      <Button
        variant="contained"
        size="large"
        color="secondary"
        sx={{ mt: 3, mb: 2 }}
        onClick={() => {
          navigate("/home");
        }}
      >
        Takaisin kotiin
      </Button>
    </Stack>
  );
};

export default NotFound;
