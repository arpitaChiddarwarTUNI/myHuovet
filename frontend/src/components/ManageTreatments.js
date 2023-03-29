import { Box } from "@mui/system";
import { 
  TextField, 
  Typography, 
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle, 
  IconButton,
  Paper
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import CreateIcon from "@mui/icons-material/Create";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  fetchExaminationtypes, 
  postExaminationtypes,
  modifyExaminationtype,
  deleteExaminationtype
} from "../store/features/examinationtypesSlice"
import ConnectionStatus from "./ConnectionStatus";

const ManageTreatments = () => {

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [location, setLocation] = useState("");

  const handleSave = () => {
    const treatmentObject = {
      name: name,
      category: "operation",
      price: parseFloat(price),
      location: location
    };
    dispatch(postExaminationtypes(treatmentObject));
    setName("");
    setPrice(0);
    setLocation("");
  };

  useEffect(() => {  
    dispatch(fetchExaminationtypes())
  }, []);

  const dispatch = useDispatch();
  const examinationtypes = useSelector((state) => state.examinationtypes); 

  const validateForm = () => {
    return (
      name.length > 0 && price > 0 
    );
  };
  
  const isPriceValid = () => {
    if (parseFloat(price) <= 0) return false;
    else return true;
  }

  const [modifyTreatmentDialogOpen, setModifyTreatmentDialogOpen] = useState(false);
  const [modifyTreatmentName, setModifyTreatmentName] = useState("");
  const [modifyTreatmentPrice, setModifyTreatmentPrice] = useState("");
  const [modifyTreatmentLocation, setModifyTreatmentLocation] = useState("");
  const [modifyTreatmentId, setModifyTreatmentId] = useState("");

  const handleModifyTreatmentSave = () => {
    const modifiedTreatmentObject = {
      name: modifyTreatmentName,
      location: modifyTreatmentLocation,
      price: parseFloat(modifyTreatmentPrice),
      category: "operation",
      id: modifyTreatmentId,
    };
    dispatch(modifyExaminationtype(modifiedTreatmentObject));
    setModifyTreatmentDialogOpen(false);
  };

  const handleCloseTreatmentDialog = () => {
    setModifyTreatmentDialogOpen(false);
  };

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleClickOpenDelete = () => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleDeleteTreatment = () => {
    dispatch(deleteExaminationtype(modifyTreatmentId));
    setOpenDeleteDialog(false);
    setModifyTreatmentDialogOpen(false);
  };

  const modifyTreatmentDialog = () => {
    return (
      <Dialog open={modifyTreatmentDialogOpen}>
        <DialogTitle>{"Muokkaa toimenpidettä"}</DialogTitle>
        <DialogContent>
          <TextField
            sx={{
              backgroundColor: "white",
              borderRadius: 1,
              margin: 1,
            }}
            id="modifyTreatmentName"
            label="Nimi"
            variant="filled"
            value={modifyTreatmentName}
            onChange={(e) => {
              setModifyTreatmentName(e.target.value);
            }}
          />
          <TextField
            sx={{
              backgroundColor: "white",
              borderRadius: 1,
              margin: 1,
            }}
            id="modifyTreatmentPrice"
            label="Hinta"
            variant="filled"
            type="number"
            value={modifyTreatmentPrice}
            onChange={(e) => {
              setModifyTreatmentPrice(e.target.value);
            }}
          />
          <TextField
            sx={{
              backgroundColor: "white",
              borderRadius: 1,
              margin: 1,
            }}
            id="modifyTreatmentLocation"
            label="Sijainti"
            variant="filled"
            value={modifyTreatmentLocation}
            onChange={(e) => {
              setModifyTreatmentLocation(e.target.value);
            }}
          />
        </DialogContent>
        <DialogActions>
          <IconButton
            id="deleteTreatment"
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
              <DialogTitle>{"Haluatko varmasti poistaa toimenpiteen?"}</DialogTitle>
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
                  onClick={handleDeleteTreatment}
                  color="warning"
                >
                  Vahvista
                </Button>
              </DialogActions>
            </Dialog>
          <Button
            variant="contained"
            onClick={handleCloseTreatmentDialog}
            color="warning"
          >
            Peruuta
          </Button>
          <Button
            variant="contained"
            onClick={handleModifyTreatmentSave}
            color="success"
            disabled={modifyTreatmentName == "" || modifyTreatmentPrice < 0 }
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
        Toimenpiteet
      </Typography>
      <Typography variant="subtitle1" color="white">
        Lisää uusi toimenpide
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
          id="Examination"
          label="Nimi"
          variant="filled"
          sx={{
            backgroundColor: "white",
            borderRadius: 1,
            marginY: 2
          }}
          value={name}
          onChange={(e) => setName(e.target.value)}
          />
        <TextField
          required
          id="Price"
          label="Hinta €"
          variant="filled"
          type="number"                
          sx={{
            backgroundColor: "white",
            borderRadius: 1,
            marginTop: 2, 
            height: 56
          }}
          value={price}
          error={!isPriceValid}
          onChange={(e) => {
            setPrice(e.target.value);
          }}
          />           
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 2
        }}
        >
        <TextField 
          fullWidth
          id="Location"
          label="Sijainti"
          variant="filled"
          sx={{
            backgroundColor: "white",
            borderRadius: 1,
            marginTop: 1
          }}
          value={location}
          onChange={(e) => setLocation(e.target.value)}
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
            handleSave();
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
        Muokkaa tai poista toimenpiteitä
      </Typography>
      {examinationtypes.examinationtypes.filter(examtype =>
          examtype.category === "operation").map(treatment => {
            return(
              <Box key={treatment.id} sx={{}}>
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
                    {treatment.name} 
                  </Typography>
                  <IconButton
                  id="modifyTreatment"
                  sx={{
                    color: "white",
                  }}
                  size="small"
                  onClick={() => {
                    setModifyTreatmentDialogOpen(true);
                    setModifyTreatmentName(treatment.name);
                    setModifyTreatmentPrice(treatment.price);
                    setModifyTreatmentLocation(treatment.location);
                    setModifyTreatmentId(treatment.id);
                  }}
                >
                  <CreateIcon></CreateIcon>
                </IconButton>
                </Box>
              </Box>
            )
          })} 
        {modifyTreatmentDialog()}
    </Box>
  );
};

export default ManageTreatments;