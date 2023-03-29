import { 
  Button,
  TextField, 
  Typography,
  IconButton,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle, 
} from "@mui/material";
import { Box } from "@mui/system";
import AddIcon from '@mui/icons-material/Add';
import CreateIcon from "@mui/icons-material/Create";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDiagnosetypes, postDiagnosetypes, modifyDiagnosetype, deleteDiagnosetype } from "../store/features/diagnosetypesSlice";
import ConnectionStatus from "./ConnectionStatus";

export default function ManageDiagnoseType() {
  const [diagnoseName, setDiagnoseName] = useState("");
  const [diagnoseCode, setDiagnoseCode] = useState("");

  const [modifyDiagnoseDialogOpen, setModifyDiagnoseDialogOpen] = useState(false);
  const [modifyDiagnoseName, setModifyDiagnoseName] = useState("");
  const [modifyDiagnoseCode, setModifyDiagnoseCode] = useState("");
  const [modifyDiagnoseId, setModifyDiagnoseId] = useState("");

  const dispatch = useDispatch();
  const diagnosetypes = useSelector((state) => state.diagnosetypes);

  const handleSave = () => {
    const newDiagnosetype = {
      name: diagnoseName,
      code: diagnoseCode,      
    };
    dispatch(postDiagnosetypes(newDiagnosetype));
    setDiagnoseName("");
    setDiagnoseCode("");
  };

  const handleModifyDiagnoseSave = () => {
    const modifiedDiagnoseObject = {
      name: modifyDiagnoseName,
      code: modifyDiagnoseCode,
      id: modifyDiagnoseId,
    };
    dispatch(modifyDiagnosetype(modifiedDiagnoseObject));
    setModifyDiagnoseDialogOpen(false);
  };

  const handleCloseDiagnoseDialog = () => {
    setModifyDiagnoseDialogOpen(false);
  };

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleClickOpenDelete = () => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleDeleteDiagnosetype = () => {
    dispatch(deleteDiagnosetype(modifyDiagnoseId));
    setOpenDeleteDialog(false);
    setModifyDiagnoseDialogOpen(false);
  };

  const validateForm = () => {
    return diagnoseName.length > 0 /* && .indexof(Diagnose) === -1 */; // check if the type is already existed
  };

  useEffect(() => {     // show/update the existed types in list when a new one is saved
    dispatch(fetchDiagnosetypes())
  }, []);

  const modifyDiagnoseDialog = () => {
    return (
      <Dialog open={modifyDiagnoseDialogOpen}>
        <DialogTitle>{"Muokkaa diagnoosia"}</DialogTitle>
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
            id="modifyDiagnoseName"
            label="Diagnoosi"
            variant="filled"
            value={modifyDiagnoseName}
            onChange={(e) => {
              setModifyDiagnoseName(e.target.value);
            }}
          />
          <TextField
            fullWidth
            sx={{
              backgroundColor: "white",
              borderRadius: 1,
              marginY: 1,
            }}
            id="modifyDiagnoseCode"
            label="Diagnoosikoodi"
            variant="filled"
            value={modifyDiagnoseCode}
            onChange={(e) => {
              setModifyDiagnoseCode(e.target.value);
            }}
          />
          </Box>
        </DialogContent>
        <DialogActions>
          <IconButton
            id="deleteDiagnose"
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
              <DialogTitle>{"Haluatko varmasti poistaa diagnoosin?"}</DialogTitle>
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
                  onClick={handleDeleteDiagnosetype}
                  color="warning"
                >
                  Vahvista
                </Button>
              </DialogActions>
            </Dialog>
          <Button
            variant="contained"
            onClick={handleCloseDiagnoseDialog}
            color="warning"
          >
            Peruuta
          </Button>
          <Button
            variant="contained"
            onClick={handleModifyDiagnoseSave}
            color="success"
            disabled={modifyDiagnoseName == ""}
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
          Diagnoosit
        </Typography>
        <Typography variant="subtitle1" color="white">
          Lisää uusi diagnoosi
        </Typography>        
        <TextField 
          margin="normal"
          required
          fullWidth
          id="Diagnose"
          label="Diagnoosi"
          variant="filled"
          sx={{
            backgroundColor: "white",
            borderRadius: 1,
          }}
          value={diagnoseName}
          onChange={(e) => setDiagnoseName(e.target.value)}
          />
        <TextField 
          margin="normal"
          fullWidth
          id="DiagnoseCode"
          label="Diagnoosikoodi"
          variant="filled"
          sx={{
            backgroundColor: "white",
            borderRadius: 1,
          }}
          value={diagnoseCode}
          onChange={(e) => setDiagnoseCode(e.target.value)}
          />
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
        Muokkaa tai poista diagnooseja
      </Typography>   
      {diagnosetypes.diagnosetypes.map((type) => { 
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
                  id="modifyDiagnose"
                  sx={{
                    color: "white",
                  }}
                  size="small"
                  onClick={() => {
                    setModifyDiagnoseDialogOpen(true);
                    setModifyDiagnoseName(type.name);
                    setModifyDiagnoseCode(type.code.String);
                    setModifyDiagnoseId(type.id);
                  }}
                >
                  <CreateIcon></CreateIcon>
                </IconButton>
              </Box>
            </Box>
          )
        })}
        {modifyDiagnoseDialog()}
      </Box>
  );
}