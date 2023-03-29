import { Button, AppBar, Toolbar, Box} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { logout } from "../store/features/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import InternetConnection from './InternetConnection'

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const appointments = useSelector((state) => state.appointments);
  const customer = useSelector((state) => state.customer);

  return (
    <AppBar position="static" color="secondary">
      <Toolbar
        sx={{
          justifyContent:
            location.pathname != "/home" ? "space-between" : "flex-end",
        }}
      >
        <Box
          sx={{
            "@media (max-width: 380px)": 
            {
              marginRight:"16px"
            },
            }}
        >
          {location.pathname == "/invoice" ? (
            <Button onClick={() => navigate(`/appointment/${appointments.singleAppointment.id}`)} sx={{ color: "white" }}>
              <ArrowBackIcon />
              Takaisin
            </Button>
          ) : (
            location.pathname != "/home" ? (
              <Button onClick={() => navigate("/home")} sx={{ color: "white" }}>
                <ArrowBackIcon />
                Takaisin
              </Button>
            ) : (
              <></>
            )
          )}
        </Box>
        <Box>
          <Button
            onClick={() => navigate("/management")}
            sx={{ 
              color: "white",
                "@media (max-width: 380px)": 
                {
                  marginBottom:"10px"
                }
            }}
          >
            Hallinnoi
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<LogoutIcon />}
            sx={{ color: "white" }}
            onClick={() => {
              dispatch(logout());
            }}
          >
            Kirjaudu ulos
          </Button>
        </Box>
      </Toolbar>
      <InternetConnection> 
      </InternetConnection>
    </AppBar>
  );
};

export default Header;
