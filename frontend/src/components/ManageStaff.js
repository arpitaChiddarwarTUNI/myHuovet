import { Box } from "@mui/system";
import { 
  TextField, 
  Typography, 
  Button,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle, 
  IconButton
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { useState, useEffect } from "react";
import { fetchStaff, addStaff, modifyStaff, deleteStaff } from "../store/features/staffSlice";
import { useDispatch, useSelector } from "react-redux";
import CreateIcon from "@mui/icons-material/Create";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ConnectionStatus from "./ConnectionStatus";

const ManageStaff = () => {

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [role, setRole] = useState("");

  const dispatch = useDispatch();
  const staff = useSelector((state) => state.staff);
  
  useEffect(() => {
    dispatch(fetchStaff())
  }, []);

  const [modifyStaffDialogOpen, setModifyStaffDialogOpen] = useState(false);
  const [modifyStaffFirstName, setModifyStaffFirstName] = useState("");
  const [modifyStaffLastName, setModifyStaffLastName] = useState("");
  const [modifyStaffRole, setModifyStaffRole] = useState("");
  const [modifyStaffId, setModifyStaffId] = useState("");

  const handleNewStaffSave = () => {
    const staffMemberObject = {
      first_name: firstname,
      last_name: lastname,
      role: role
    };
    dispatch(addStaff(staffMemberObject));
    setFirstname("");
    setLastname("");
    setRole("");
  };

  const handleModifyStaffSave = () => {
    const modifiedStaffObject = {
      first_name: modifyStaffFirstName,
      last_name: modifyStaffLastName,
      role: modifyStaffRole,
      id: modifyStaffId,
    };
    dispatch(modifyStaff(modifiedStaffObject));
    setModifyStaffDialogOpen(false);
  };

  const validateForm = () => {
    return firstname.length > 0 && lastname.length > 0 && role.length > 0;
  };

  const handleCloseStaffDialog = () => {
    setModifyStaffDialogOpen(false);
  };

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleClickOpenDelete = () => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleDeleteStaffMember = () => {
    dispatch(deleteStaff(modifyStaffId));
    setOpenDeleteDialog(false);
    setModifyStaffDialogOpen(false);
  };

  const modifyStaffDialog = () => {
    return (
      <Dialog open={modifyStaffDialogOpen}>
        <DialogTitle>{"Muokkaa henkilökunnan jäsentä"}</DialogTitle>
        <DialogContent>
          <TextField
            sx={{
              backgroundColor: "white",
              borderRadius: 1,
              margin: 1,
            }}
            id="modifyStaffFirstName"
            label="Etunimi"
            variant="filled"
            value={modifyStaffFirstName}
            onChange={(e) => {
              setModifyStaffFirstName(e.target.value);
            }}
          />
          <TextField
            sx={{
              backgroundColor: "white",
              borderRadius: 1,
              margin: 1,
            }}
            id="modifyStaffLastName"
            label="Sukunimi"
            variant="filled"
            value={modifyStaffLastName}
            onChange={(e) => {
              setModifyStaffLastName(e.target.value);
            }}
          />
          <TextField
            sx={{
              backgroundColor: "white",
              borderRadius: 1,
              margin: 1,
            }}
            id="modifyStaffRole"
            label="Tehtävä/ammattinimike"
            variant="filled"
            value={modifyStaffRole}
            onChange={(e) => {
              setModifyStaffRole(e.target.value);
            }}
          />
        </DialogContent>
        <DialogActions>
          <IconButton
            id="deleteStaffMember"
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
              <DialogTitle>{"Haluatko varmasti poistaa henkilökunnan jäsenen?"}</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Kaikki henkilön tiedot poistetaan. Tätä toimintoa ei voi
                  kumota.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button variant="contained" onClick={handleCloseDeleteDialog} color="info">
                  Peruuta
                </Button>
                <Button
                  variant="contained"
                  onClick={handleDeleteStaffMember}
                  color="warning"
                >
                  Vahvista
                </Button>
              </DialogActions>
            </Dialog>
          <Button
            variant="contained"
            onClick={handleCloseStaffDialog}
            color="warning"
          >
            Peruuta
          </Button>
          <Button
            variant="contained"
            onClick={handleModifyStaffSave}
            color="success"
            disabled={modifyStaffFirstName == "" || modifyStaffLastName == "" || modifyStaffRole == ""}
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
        Henkilökunta
      </Typography>
      <Typography variant="subtitle1" color="white">
        Lisää uusi henkilökunnan jäsen
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
          id="firstname"
          label="Etunimi"
          variant="filled"
          sx={{
            backgroundColor: "white",
            borderRadius: 1,
          }}
          value={firstname}
          onChange={(e) => setFirstname(e.target.value)}
          />
        <TextField 
          margin="normal"
          required
          fullWidth
          id="lastname"
          label="Sukunimi"
          variant="filled"
          sx={{
            backgroundColor: "white",
            borderRadius: 1,
          }}
          value={lastname}
          onChange={(e) => setLastname(e.target.value)}
          />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 2,
          alignItems: "center"
        }}
        >
        <TextField 
          margin="normal"
          required
          fullWidth
          id="role"
          label="Tehtävä/ammattinimike"
          variant="filled"
          sx={{
            backgroundColor: "white",
            borderRadius: 1,
          }}
          value={role}
          onChange={(e) => setRole(e.target.value)}
          />
          <Button 
            type="submit"
            variant="contained"
            size="large"
            color="success"
            margin="normal"
            sx={{height: 56, marginTop: 1}}
            startIcon={<AddIcon />}
            onClick={() => {
              handleNewStaffSave();
            }}
            disabled={!validateForm()}
            >
            Lisää
          </Button>
      </Box>
      <ConnectionStatus>
      </ConnectionStatus>
      <Typography 
        variant="subtitle1" 
        color="white" 
        sx={{marginTop: 4, marginBottom: 2}}
        >
        Muokkaa tai poista henkilökunnan jäseniä
      </Typography>
      {staff.staff.map((staff) => {
        return (
          <Box key={staff.id} sx={{}}>
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
                {staff.first_name} {staff.last_name}

              </Typography>
              <IconButton
                id="modifyStaff"
                sx={{
                  color: "white",
                }}
                size="small"
                onClick={() => {
                  setModifyStaffDialogOpen(true);
                  setModifyStaffFirstName(staff.first_name);
                  setModifyStaffLastName(staff.last_name);
                  setModifyStaffRole(staff.role.String);
                  setModifyStaffId(staff.id);
                }}
              >
                <CreateIcon></CreateIcon>
              </IconButton>
            </Box>
          </Box>
        )
      })} 
      {modifyStaffDialog()}
    </Box>
  );
};

export default ManageStaff;