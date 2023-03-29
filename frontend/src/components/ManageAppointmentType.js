import { 
  Button,
  TextField, 
  Typography,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle, 
  IconButton,
} from "@mui/material";
import CreateIcon from "@mui/icons-material/Create";
import { Box } from "@mui/system";
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import InputAdornment from "@mui/material/InputAdornment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  fetchAppointmenttypes, 
  postAppointmenttypes,
  modifyAppointmenttype,
  deleteAppointmenttype
} from "../store/features/appointmenttypesSlice";
import ConnectionStatus from "./ConnectionStatus";

export default function ManageAppointmentType() {
  const [appointmentType, setAppointmentType] = useState("");
  const [appointmentLength, setAppointmentLength] = useState(0);

  const [modifyAppointmenttypeDialogOpen, setModifyAppointmenttypeDialogOpen] = useState(false);
  const [modifyAppointmenttypeName, setModifyAppointmenttypeName] = useState("");
  const [modifyAppointmenttypeLength, setModifyAppointmenttypeLength] = useState("");
  const [modifyAppointmenttypeId, setModifyAppointmenttypeId] = useState("");

  const dispatch = useDispatch();
  const appointmenttypes = useSelector((state) => state.appointmenttypes);

  const handleSave = () => {
    const newAppointmentType = {
      name: appointmentType,
      default_length: parseInt(appointmentLength),
    }
    dispatch(postAppointmenttypes(newAppointmentType));
    setAppointmentType("");
    setAppointmentLength(0);
  };

  const handleModifyAppointmenttypeSave = () => {
    const modifiedAppointmenttypeObject = {
      name: modifyAppointmenttypeName,
      default_length: parseInt(modifyAppointmenttypeLength),
      id: modifyAppointmenttypeId,
    };
    dispatch(modifyAppointmenttype(modifiedAppointmenttypeObject));
    setModifyAppointmenttypeDialogOpen(false);
  };

  const handleCloseAppointmenttypeDialog = () => {
    setModifyAppointmenttypeDialogOpen(false);
  };

  const validateForm = () => {
    return appointmentType.length > 0 && appointmentLength > 0 /* && .indexof(appointmentType) === -1 */; // check if the type is already existed
  };

  useEffect(() => {     // show/update the existed types in list when a new one is saved
    dispatch(fetchAppointmenttypes())
  }, []);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleClickOpenDelete = () => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleDeleteAppointmenttype = () => {
    dispatch(deleteAppointmenttype(modifyAppointmenttypeId));
    setOpenDeleteDialog(false);
    setModifyAppointmenttypeDialogOpen(false);
  };

  const modifyAppointmenttypeDialog = () => {
    return (
      <Dialog open={modifyAppointmenttypeDialogOpen}>
        <DialogTitle>{"Muokkaa käyntityyppiä"}</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 2
            }}>
          <TextField
            fullWidth
            sx={{
              backgroundColor: "white",
              borderRadius: 1,
              marginY: 1,
            }}
            id="modifyAppointmenttypeName"
            label="Nimi"
            variant="filled"
            value={modifyAppointmenttypeName}
            onChange={(e) => {
              setModifyAppointmenttypeName(e.target.value);
            }}
          />
          <TextField
            fullWidth
            sx={{
              backgroundColor: "white",
              borderRadius: 1,
              marginY: 1,
            }}
            id="modifyAppointmenttypeLength"
            label="Kesto"
            variant="filled"
            type="number"
            value={modifyAppointmenttypeLength}
            onChange={(e) => {
              setModifyAppointmenttypeLength(e.target.value);
            }}
            InputProps={{
              endAdornment: 
                <InputAdornment position="end">min</InputAdornment>
              }}
          />
          </Box>
        </DialogContent>
        <DialogActions>
          <IconButton
            id="deleteAppointmentType"
            sx={{
              color: "white",
              marginX: 2,
            }}
            size="large"
            onClick={handleClickOpenDelete}
          >
            <DeleteOutlineIcon />
          </IconButton>
          <Dialog
              open={openDeleteDialog}
              onClose={handleCloseDeleteDialog}
              PaperComponent={({ children }) => (
                <Paper style={{ background: "white" }}>{children}</Paper>
              )}
            >
              <DialogTitle>{"Haluatko varmasti poistaa käyntityypin?"}</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Tätä toimintoa ei voi kumota.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button variant="contained" onClick={handleCloseDeleteDialog} color="info">
                  Peruuta
                </Button>
                <Button
                  variant="contained"
                  onClick={handleDeleteAppointmenttype}
                  color="warning"
                >
                  Vahvista
                </Button>
              </DialogActions>
            </Dialog>
          <Button
            variant="contained"
            onClick={handleCloseAppointmenttypeDialog}
            color="warning"
          >
            Peruuta
          </Button>
          <Button
            variant="contained"
            onClick={handleModifyAppointmenttypeSave}
            color="success"
            disabled={modifyAppointmenttypeName == "" || modifyAppointmenttypeLength <= 0}
          >
            Vahvista
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
      <Box>
        <Typography variant="h5" color="white" sx={{marginBottom: 3}}>
          Käyntityypit
        </Typography>
        <Typography variant="subtitle1" color="white">
          Lisää uusi käyntityyppi
        </Typography>  
        <Box 
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 2
          }}
        >    
          <TextField 
            margin="normal"
            required
            fullWidth
            id="appointmenttype"
            label="Käyntityyppi"
            variant="filled"
            sx={{
              backgroundColor: "white",
              borderRadius: 1,
            }}
            value={appointmentType}
            onChange={(e) => setAppointmentType(e.target.value)}
            />
          <TextField 
            margin="normal"
            required
            
            id="appointmentlength"
            label="Kesto (min)"
            variant="filled"
            type="number"
            sx={{
              backgroundColor: "white",
              borderRadius: 1,
            }}
            value={appointmentLength}
            onChange={(e) => setAppointmentLength(e.target.value)}
            />
        </Box>
        <ConnectionStatus>
        </ConnectionStatus> 
        <Button 
          type="submit"
          variant="contained"
          size="large"
          color="success"
          margin="normal"
          sx={{height: 56, marginTop: 1}}
          startIcon={<AddIcon />}
          onClick={() => {
            handleSave();
          }}
          disabled={!validateForm()}
          >
          Lisää
        </Button>  
      <Typography 
        variant="subtitle1" 
        color="white" 
        sx={{marginTop: 4, marginBottom: 2}}
        >
        Muokkaa tai poista käyntityyppejä
      </Typography>   
      {appointmenttypes.appointmenttypes.map((type) => { 
        return (
          <Box key={type.id} sx={{}}>
              <Box
                sx={{
                  borderBottom: 1,
                  display: "flex",
                  justifyContent: "space-between",
                  flexDirection: "row",
                }}
              >
                <Typography
                  color="#1e1f1f"
                  variant="h7"
                  sx={{ fontWeight: "bold" }}
                >
                  {type.name}
                </Typography>
                <IconButton
                  id="modifyAppointmenttype"
                  sx={{
                    color: "white",
                  }}
                  size="small"
                  onClick={() => {
                    setModifyAppointmenttypeDialogOpen(true);
                    setModifyAppointmenttypeName(type.name);
                    setModifyAppointmenttypeLength(type.default_length);
                    setModifyAppointmenttypeId(type.id);
                  }}
                >
                  <CreateIcon></CreateIcon>
                </IconButton>
              </Box>
            </Box>
          )
        })}
        {modifyAppointmenttypeDialog()}
    </Box>
  );
}