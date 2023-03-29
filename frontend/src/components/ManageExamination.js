import { 
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle, 
  TextField, 
  Typography,
  IconButton,
  Paper
} from "@mui/material";
import { Box } from "@mui/system";
import AddIcon from '@mui/icons-material/Add';
import CreateIcon from "@mui/icons-material/Create";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  fetchExaminationtypes, 
  postExaminationtypes, 
  modifyExaminationtype, 
  deleteExaminationtype 
} from "../store/features/examinationtypesSlice";
import ConnectionStatus from "./ConnectionStatus";
  
export default function ManageExamination() {
  const [examination, setExamination] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState(0);
  
  const dispatch = useDispatch();
  const examinationtypes = useSelector((state) => state.examinationtypes); // WHERE category="examination"

  const handleSave = () => {
    const newExamtype = {
      name: examination,
      location: location,
      price: parseFloat(price),
      category: "examination",
    };
    dispatch(postExaminationtypes(newExamtype));
    setExamination("");
    setLocation("");
    setPrice(0);
  };

  const validateForm = () => {
    return examination.length > 0 && price > 0; 
  };

  const isPriceValid = () => {
    if (parseFloat(price) <= 0) return false;
    else return true;
  }

  useEffect(() => {  
    dispatch(fetchExaminationtypes())
  }, []);

  const [modifyExaminationDialogOpen, setModifyExaminationDialogOpen] = useState(false);
  const [modifyExaminationName, setModifyExaminationName] = useState("");
  const [modifyExaminationPrice, setModifyExaminationPrice] = useState("");
  const [modifyExaminationLocation, setModifyExaminationLocation] = useState("");
  const [modifyExaminationId, setModifyExaminationId] = useState("");

  const handleModifyExaminationSave = () => {
    const modifiedExaminationObject = {
      name: modifyExaminationName,
      location: modifyExaminationLocation,
      price: parseFloat(modifyExaminationPrice),
      category: "examination",
      id: modifyExaminationId,
    };
    dispatch(modifyExaminationtype(modifiedExaminationObject));
    setModifyExaminationDialogOpen(false);
  };

  const handleCloseExaminationDialog = () => {
    setModifyExaminationDialogOpen(false);
  };

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleClickOpenDelete = () => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleDeleteExamination = () => {
    dispatch(deleteExaminationtype(modifyExaminationId));
    setOpenDeleteDialog(false);
    setModifyExaminationDialogOpen(false);
  };

  const modifyExaminationDialog = () => {
    return (
      <Dialog open={modifyExaminationDialogOpen}>
        <DialogTitle>{"Muokkaa tutkimusta"}</DialogTitle>
        <DialogContent>
          <TextField
            sx={{
              backgroundColor: "white",
              borderRadius: 1,
              margin: 1,
            }}
            id="modifyExaminationName"
            label="Nimi"
            variant="filled"
            value={modifyExaminationName}
            onChange={(e) => {
              setModifyExaminationName(e.target.value);
            }}
          />
          <TextField
            sx={{
              backgroundColor: "white",
              borderRadius: 1,
              margin: 1,
            }}
            id="modifyExaminationPrice"
            label="Hinta"
            variant="filled"
            type="number"
            value={modifyExaminationPrice}
            onChange={(e) => {
              setModifyExaminationPrice(e.target.value);
            }}
          />
          <TextField
            sx={{
              backgroundColor: "white",
              borderRadius: 1,
              margin: 1,
            }}
            id="modifyExaminationLocation"
            label="Sijainti"
            variant="filled"
            value={modifyExaminationLocation}
            onChange={(e) => {
              setModifyExaminationLocation(e.target.value);
            }}
          />
        </DialogContent>
        <DialogActions>
          <IconButton
            id="deleteExamination"
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
              <DialogTitle>{"Haluatko varmasti poistaa tutkimuksen?"}</DialogTitle>
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
                  onClick={handleDeleteExamination}
                  color="warning"
                >
                  Vahvista
                </Button>
              </DialogActions>
            </Dialog>
          <Button
            variant="contained"
            onClick={handleCloseExaminationDialog}
            color="warning"
          >
            Peruuta
          </Button>
          <Button
            variant="contained"
            onClick={handleModifyExaminationSave}
            color="success"
            disabled={modifyExaminationName == "" || modifyExaminationPrice <= 0 }
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
        Mittaukset ja tutkimukset
      </Typography>
      <Typography variant="subtitle1" color="white">
        Lisää uusi mittaus tai tutkimus
      </Typography>          
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 2
        }}
        >
        <TextField 
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
          value={examination}
          onChange={(e) => setExamination(e.target.value)}
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
        Muokkaa tai poista mittauksia ja tutkimuksia
      </Typography>
      {examinationtypes.examinationtypes.filter(examtype =>
        examtype.category === "examination").map(exam => {
          return(
            <Box key={exam.id} sx={{}}>
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
                  {exam.name} 
                </Typography>
                <IconButton
                  id="modifyTreatment"
                  sx={{
                    color: "white",
                  }}
                  size="small"
                  onClick={() => {
                    setModifyExaminationDialogOpen(true);
                    setModifyExaminationName(exam.name);
                    setModifyExaminationPrice(exam.price);
                    setModifyExaminationLocation(exam.location);
                    setModifyExaminationId(exam.id);
                  }}
                >
                  <CreateIcon></CreateIcon>
                </IconButton>
              </Box>
            </Box>
          )
        })}
      {modifyExaminationDialog()}
    </Box>
  );
}