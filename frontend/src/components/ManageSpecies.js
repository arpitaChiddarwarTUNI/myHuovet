import { Box } from "@mui/system";
import {
  TextField,
  Typography,
  Button,
  FormControl,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CreateIcon from "@mui/icons-material/Create";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useState, useEffect } from "react";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchSpecies,
  postSpecie,
  postBreed,
  modifySpecie,
  modifyBreed,
  deleteSpecie,
  deleteBreed
} from "../store/features/speciesSlice";
import { IconButton } from "@mui/material";
import ConnectionStatus from "./ConnectionStatus";

const ManageSpecies = () => {
  const [newSpeciesName, setNewSpeciesName] = useState("");
  const [newBreedSpecieId, setNewBreedSpecieId] = useState("");
  const [newBreedName, setNewBreedName] = useState("");
  const [newBreedAverageWeight, setNewBreedAverageWeight] = useState("0");

  const [modifySpecieDialogOpen, setModifySpecieDialogOpen] = useState(false);
  const [modifyBreedDialogOpen, setModifyBreedDialogOpen] = useState(false);

  const [modifySpeciesName, setModifySpeciesName] = useState("");
  const [modifySpeciesId, setModifySpeciesId] = useState("");

  const [modifyBreedName, setModifyBreedName] = useState("");
  const [modifyBreedId, setModifyBreedId] = useState("");
  const [modifyBreedSpecie, setModifyBreedSpecie] = useState("");
  const [modifyBreedAvgWeight, setModifyBreedAvgWeight] = useState("");

  const dispatch = useDispatch();
  const species = useSelector((state) => state.species);

  useEffect(() => {
    dispatch(fetchSpecies())
  }, []);

  const handleCloseSpecieDialog = () => {
    setModifySpecieDialogOpen(false);
  };
  const handleCloseBreedDialog = () => {
    setModifyBreedDialogOpen(false);
  };

  const handleNewBreedSpecieChange = (event) => {
    setNewBreedSpecieId(event.target.value);
  };

  const handleNewSpeciesSave = () => {
    const newSpecies = {
      name: newSpeciesName,
    };
    dispatch(postSpecie(newSpecies));
    setNewSpeciesName("");
  };

  const handleNewBreedSave = () => {
    const newBreed = {
      name: newBreedName,
      species_id: newBreedSpecieId,
      average_weight: parseInt(newBreedAverageWeight),
    };
    dispatch(postBreed(newBreed));
    setNewBreedSpecieId("");
    setNewBreedName("");
    setNewBreedAverageWeight("0");
  };

  const handleModifySpecieSave = () => {
    const modifiedSpecieObject = {
      name: modifySpeciesName,
      id: modifySpeciesId,
    };
    dispatch(modifySpecie(modifiedSpecieObject));
    setModifySpecieDialogOpen(false);
  };

  const handleModifyBreedSave = () => {
    const modifiedBreedObject = {
      species_id: modifyBreedSpecie,
      average_weight: parseInt(modifyBreedAvgWeight),
      id: modifyBreedId,
      name: modifyBreedName,
    };
    dispatch(modifyBreed(modifiedBreedObject));
    setModifyBreedDialogOpen(false);
  };

  const validateNewSpeciesForm = () => {
    return newSpeciesName.length;
  };

  const validateNewBreedForm = () => {
    return newBreedName.length && newBreedSpecieId && newBreedAverageWeight;
  };

  const isWeightValid = () => {
    if (newBreedAverageWeight == "" || parseInt(newBreedAverageWeight) != newBreedAverageWeight) return false;
    return true;
  };

  const [openDeleteBreedDialog, setOpenDeleteBreedDialog] = useState(false);

  const handleClickOpenDeleteBreed = () => {
    setOpenDeleteBreedDialog(true);
  };

  const handleCloseDeleteBreedDialog = () => {
    setOpenDeleteBreedDialog(false);
  };

  const handleDeleteBreed = () => {
    dispatch(deleteBreed(modifyBreedId));
    setOpenDeleteBreedDialog(false);
    setModifyBreedDialogOpen(false);
  };

  const [openDeleteSpecieDialog, setOpenDeleteSpecieDialog] = useState(false);

  const handleClickOpenDeleteSpecie = () => {
    setOpenDeleteSpecieDialog(true);
  };

  const handleCloseDeleteSpecieDialog = () => {
    setOpenDeleteSpecieDialog(false);
  };

  const handleDeleteSpecie = () => {
    dispatch(deleteSpecie(modifySpeciesId));
    setOpenDeleteSpecieDialog(false);
    setModifySpecieDialogOpen(false);
  };

  const modifySpecieDialog = () => {
    return (
      <Dialog open={modifySpecieDialogOpen}>
        <DialogTitle>{"Laji"}</DialogTitle>
        <DialogContent>
          <TextField
            sx={{
              backgroundColor: "white",
              borderRadius: 1,
            }}
            id="modifySpecie"
            label="Laji"
            variant="filled"
            value={modifySpeciesName}
            onChange={(e) => {
              setModifySpeciesName(e.target.value);
            }}
          />
        </DialogContent>
        <DialogActions>
          <IconButton
            id="deleteSpecie"
            sx={{
              color: "white",
              marginX: 2,
            }}
            size="large"
            onClick={handleClickOpenDeleteSpecie}
          >
            <DeleteOutlineIcon />
          </IconButton>
          <Dialog
            open={openDeleteSpecieDialog}
            onClose={handleCloseDeleteSpecieDialog}
            PaperComponent={({ children }) => (
              <Paper style={{ background: "white" }}>{children}</Paper>
            )}
          >
            <DialogTitle>{"Haluatko varmasti poistaa lajin?"}</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Laji ja kaikki siihen liitetyt rodut poistetaan. 
                Tätä toimintoa ei voi kumota.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button variant="contained" onClick={handleCloseDeleteSpecieDialog} color="info">
                Peruuta
              </Button>
              <Button
                variant="contained"
                onClick={handleDeleteSpecie}
                color="warning"
              >
                Vahvista
              </Button>
            </DialogActions>
          </Dialog>
          <Button
            variant="contained"
            onClick={handleCloseSpecieDialog}
            color="warning"
          >
            Peruuta
          </Button>
          <Button
            variant="contained"
            onClick={handleModifySpecieSave}
            color="success"
            disabled={modifySpeciesName == ""}
          >
            Vahvista
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const modifyBreedDialog = () => {
    return (
      <Dialog open={modifyBreedDialogOpen}>
        <DialogTitle>{"Rotu"}</DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            required
            fullWidth
            id="modifyBreed"
            label="Rotu"
            variant="filled"
            sx={{
              backgroundColor: "white",
              borderRadius: 1,
            }}
            value={modifyBreedName}
            onChange={(e) => setModifyBreedName(e.target.value)}
          />
          <FormControl fullWidth sx={{ marginTop: 1 }}>
            <InputLabel variant="filled" required>
              Laji
            </InputLabel>
            <Select
              variant="filled"
              value={modifyBreedSpecie}
              style={{ backgroundColor: "#f0f0f0" }}
              onChange={(e) => setModifyBreedSpecie(e.target.value)}
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
              {species.species.map((specie) => {
                return (
                  <MenuItem key={specie.id} value={specie.id}>
                    {specie.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>

          <TextField
            margin="normal"
            fullWidth
            required
            label="Keskipaino (kg)"
            variant="filled"
            type="number"
            sx={{
              backgroundColor: "white",
              borderRadius: 1,
            }}
            value={modifyBreedAvgWeight}
            error={!isWeightValid()}
            helperText={!isWeightValid() ? "Syötä kokonaisluku!" : ""}
            onChange={(e) => setModifyBreedAvgWeight(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <IconButton
            id="deleteBreed"
            sx={{
              color: "white",
              marginX: 2,
            }}
            size="large"
            onClick={handleClickOpenDeleteBreed}
          >
            <DeleteOutlineIcon />
          </IconButton>
          <Dialog
            open={openDeleteBreedDialog}
            onClose={handleCloseDeleteBreedDialog}
            PaperComponent={({ children }) => (
              <Paper style={{ background: "white" }}>{children}</Paper>
            )}
          >
            <DialogTitle>{"Haluatko varmasti poistaa rodun?"}</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Tätä toimintoa ei voi kumota.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button variant="contained" onClick={handleCloseDeleteBreedDialog} color="info">
                Peruuta
              </Button>
              <Button
                variant="contained"
                onClick={handleDeleteBreed}
                color="warning"
              >
                Vahvista
              </Button>
            </DialogActions>
          </Dialog>
          <Button
            variant="contained"
            onClick={handleCloseBreedDialog}
            color="warning"
          >
            Peruuta
          </Button>
          <Button
            variant="contained"
            onClick={handleModifyBreedSave}
            color="success"
            disabled={
              !(
                modifyBreedName.length &&
                modifyBreedSpecie &&
                modifyBreedAvgWeight
              )
            }
          >
            Vahvista
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <Box>
      <Typography variant="h5" color="white" sx={{ marginBottom: 3 }}>
        Lajit ja rodut
      </Typography>
      <Typography variant="subtitle1" color="white">
        Lisää uusi laji
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 2,
        }}
      >
        <TextField
          margin="normal"
          required
          fullWidth
          id="newSpeciesName"
          label="Laji"
          variant="filled"
          sx={{
            backgroundColor: "white",
            borderRadius: 1,
          }}
          value={newSpeciesName}
          onChange={(e) => setNewSpeciesName(e.target.value)}
        />
      </Box>
      <Button
        id="specie"
        type="submit"
        variant="contained"
        size="large"
        color="success"
        margin="normal"
        sx={{ height: 56, minWidth: 100, marginTop: 1 }}
        startIcon={<AddIcon />}
        onClick={() => {
          handleNewSpeciesSave();
        }}
        disabled={!validateNewSpeciesForm()}
      >
        Lisää
      </Button>
      <Typography variant="subtitle1" color="white" sx={{ marginTop: 4 }}>
        Lisää rotu
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 2,
          alignItems: "center",
        }}
      >
        <TextField
          margin="normal"
          required
          fullWidth
          id="breed"
          label="Rotu"
          variant="filled"
          sx={{
            backgroundColor: "white",
            borderRadius: 1,
          }}
          value={newBreedName}
          onChange={(e) => setNewBreedName(e.target.value)}
        />
        <FormControl fullWidth sx={{ marginTop: 1 }}>
          <InputLabel variant="filled" required>
            Laji
          </InputLabel>
          <Select
            variant="filled"
            value={newBreedSpecieId}
            style={{ backgroundColor: "#f0f0f0" }}
            onChange={handleNewBreedSpecieChange}
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
            {species.species.map((specie) => {
              return (
                <MenuItem key={specie.id} value={specie.id}>
                  {specie.name}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 2,
          alignItems: "center",
        }}
      >
        <TextField
          margin="normal"
          required
          label="Keskipaino (kg)"
          variant="filled"
          type="number"
          sx={{
            backgroundColor: "white",
            borderRadius: 1,
          }}
          value={newBreedAverageWeight}
          error={!isWeightValid()}
          helperText={!isWeightValid() ? "Syötä kokonaisluku!" : ""}
          onChange={(e) => setNewBreedAverageWeight(e.target.value)}
        />
      </Box>
      <ConnectionStatus>
      </ConnectionStatus>
      <Button
        id="addBreed"
        type="submit"
        variant="contained"
        size="large"
        color="success"
        margin="normal"
        sx={{ height: 56, minWidth: 100, marginTop: 1 }}
        startIcon={<AddIcon />}
        onClick={() => {
          handleNewBreedSave();
        }}
        disabled={!validateNewBreedForm()}
      >
        Lisää
      </Button>
      <Typography
        variant="subtitle1"
        color="white"
        sx={{ marginTop: 4, marginBottom: 2 }}
      >
        Muokkaa tai poista lajeja ja rotuja
      </Typography>
      {species.species.map((specie) => {
        return (
          <Box key={specie.id} sx={{}}>
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
                {specie.name}
              </Typography>

              <IconButton
                id="modifySpecie"
                sx={{
                  color: "white",
                }}
                size="small"
                onClick={() => {
                  setModifySpecieDialogOpen(true);
                  setModifySpeciesName(specie.name);
                  setModifySpeciesId(specie.id);
                }}
              >
                <CreateIcon></CreateIcon>
              </IconButton>
            </Box>
            {specie.Breeds
              ? specie.Breeds.map((breed) => {
                  return (
                    <Box
                      key={breed.id}
                      sx={{
                        borderBottom: 1,
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography
                        color="#1e1f1f"
                        variant="h7"
                        sx={{ marginLeft: 1 }}
                      >
                        {breed.name}
                      </Typography>
                      <IconButton
                        id="modifyBreed"
                        sx={{
                          color: "white",
                        }}
                        size="small"
                        onClick={() => {
                          setModifyBreedDialogOpen(true);
                          setModifyBreedName(breed.name);
                          setModifyBreedId(breed.id);
                          setModifyBreedSpecie(specie.id);
                          setModifyBreedAvgWeight(breed.average_weight.Int64);
                        }}
                      >
                        <CreateIcon></CreateIcon>
                      </IconButton>
                    </Box>
                  );
                })
              : null}
          </Box>
        );
      })}
      {modifySpecieDialog()}
      {modifyBreedDialog()}
    </Box>
  );
};

export default ManageSpecies;
