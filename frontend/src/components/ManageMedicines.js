import { Box } from "@mui/system";
import "./ComponentsStylesheet.css"
import ConnectionStatus from './ConnectionStatus'
import {
  TextField,
  Typography,
  Button,
  FormControl,
  IconButton,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle, Grid,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { fetchVatGroups } from "../store/features/vatGroupSlice";
import { Paginator } from "primereact/paginator";
import CreateIcon from "@mui/icons-material/Create";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import InputAdornment from "@mui/material/InputAdornment";
import { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import { Toast } from "primereact/toast";
import {
  fetchMedicines,
  addMedicine,
  modifyMedicine,
  deleteMedicine,
  searchMedicines
} from "../store/features/medicineSlice";
import moment from "moment";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { setLoader } from "../store/features/loadingSlice";
import { Message } from "primereact/message";
import Quagga from 'quagga';


const ManageMedicines = () => {
  const [code, setCode] = useState("");
  const [barCode, setBarCode] = useState("");
  const [price, setPrice] = useState(0.0);
  const [alert_level, setAlertLevel] = useState("");
  const [vatGroup, setVatGroup] = useState("");
  const [name, setName] = useState("");
  const [strength, setStrength] = useState("");
  const [unit, setUnit] = useState("");
  const [activeSubstance, setActiveSubstance] = useState("");
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [pageSize, setPageSize] = useState(5);
  const [modifyMedicineDialogOpen, setModifyMedicineDialogOpen] = useState(false);
  const [modifyName, setModifyName] = useState("");
  const [modifyActiveSubstance, setModifyActiveSubstance] = useState("");
  const [modifyStrength, setModifyStrength] = useState("");
  const [modifyUnit, setModifyUnit] = useState("");
  const [modifyId, setModifyId] = useState("");
  const [modifyMedicineCode, setModifyMedicineCode] = useState("");
  const [modifyBarCode, setModifiyBarCode] = useState("");
  const [modifyPrice, setModifyPrice] = useState(0.0);
  const [modifyAlertLevel, setModifiyAlertLevel] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [selectValue, setSelectValue] = useState("name");
  const toast = useRef(null);

  const [addMedicineDialogOpen, setAddMedicineDialogOpen] = useState(false);
  const [first, setFirst] = useState(0);
  const [page, setPage] = useState(0);
  const [ordering, setOrdering] = useState("name");
  const [includeArchive, setIncludeArchive] = useState(false);

  const loading = useSelector((state) => state.loading);

  const dispatch = useDispatch();
  const medicines = useSelector((state) => state.medicines);
  const vatGroups = useSelector((state) => state.vatGroups);

  const [changePage, setchangePage] = useState(0);
  const [codelist, setCodelist] = useState([]);
  const [codeModified, setCodeModified] = useState(false);
  const [codePrev, setCodeprev] = useState("");

  const [barCodelist, setBarCodelist] = useState([]);
  const [barCodeModified, setBarCodeModified] = useState(false);
  const [barCodePrev, setBarCodeprev] = useState("");

  let localCodelist = [];
  let localBarCodelist = [];

  function startScanner() {
    Quagga.init({
      inputStream : {
        name : "Live",
        type : "LiveStream",
        target: document.querySelector('#scanner')
      },
      decoder: {
        readers : ["ean_reader"]
      }
    }, function(err) {
        if (err) {
          console.log(err);
          return;
        }
        console.log("Initialization finished. Ready to start");
        Quagga.start();
    });
  
    Quagga.onDetected(function(result) {
      setBarCode(result.codeResult.code);
      Quagga.stop();
    });
  }
  

  const onGlobalFilterChange = (e) => {
    const searchKeyword = e.target.value;
    setGlobalFilterValue(searchKeyword);
    setFirst(1);
    setPage(1);
    setchangePage(1);

    if (searchKeyword && searchKeyword != "") {

      dispatch(
        searchMedicines(
          1,
          pageSize,
          ordering,
          includeArchive,
          searchKeyword,
          selectValue
        )
      );
    } else {
      dispatch(
        fetchMedicines(
          1,
          pageSize,
          ordering,
          includeArchive,
          searchKeyword,
          selectValue
        )
      );
    }
  };

  const selectValueHandler = (event) => {
    setSelectValue(event.target.value);
  };

  useEffect(() => {
    dispatch(
      fetchMedicines(page, pageSize, ordering, includeArchive, selectValue)
    );
    dispatch(fetchVatGroups());
    dispatch(setLoader(false));

    medicines.results.forEach((element) => {
      if (element.code !== "")
        localCodelist.push(element.code);

      if (element.barcode !== "")
        localBarCodelist.push(element.barcode);
    });

    setCodelist(localCodelist);
    setBarCodelist(localBarCodelist);

  }, []);

  const handleSave = () => {

    let found = false;
    let barcodeFound = false;

    codelist.forEach((element) => {
      if (element === code)
        found = true;

      if (element === barCode)
        barcodeFound = true;
    });

    if (found) {
      showToast("error", "Virhe", "Lääke koodilla " + code + " on jo olemassa");
    }
    if (barcodeFound) {
      showToast("error", "Virhe", "Lääke viivakoodilla " + barCode + " on jo olemassa");
    }

    const medicineObject = {
      name: name,
      code: code,
      vat_group: vatGroup,
      item_list: "https://awstest.provetcloud.com/7357/api/0.1/itemlist/1/",
      type_code: "2",
      active_substance: activeSubstance,
      unit: unit,
      strength: strength,
      price: price,
      barcode: barCode,
      alert_level: alert_level,
    };

    localCodelist = codelist;
    localCodelist.push(medicineObject.code);
    setCodelist(localCodelist);

    localBarCodelist = barCodelist;
    localBarCodelist.push(medicineObject.barcode);
    setBarCodelist(localBarCodelist);

    dispatch(addMedicine(medicineObject));
    setCode("");
    showToast("success", "Saved", "New medicine added successfully.");
    setName("");
    setUnit("");
    setStrength("");
    setActiveSubstance("");
    setAlertLevel(0);
    setPrice(0.0);
    setBarCode("");
    setVatGroup("");
    closeAddMedicineDialogHandler();
    dispatch(
      searchMedicines(1, pageSize, ordering, includeArchive, name, selectValue)
    );
  };

  const handleUnitChange = (event) => {
    setUnit(event.target.value);
  };

  const handleModifyUnitChange = (event) => {
    setModifyUnit(event.target.value);
  };

  const validateForm = () => {
    return (
      name.length > 0 &&
      activeSubstance.length > 0 &&
      strength.length > 0 &&
      unit.length > 0 &&
      code !== "" &&
      price !== null &&
      vatGroup.length > 0
    );
  };

  const totalRecords = medicines?.count;


  const onPageEvent = (evt) => {

    const page1 = evt.page + 1;
    const useSearch = changePage === 1 && globalFilterValue !== "";
    const useFetch = !useSearch && globalFilterValue === "";

    if (useSearch) {
      setFirst(1);
      setPage(1);
      setchangePage(0);
      setPageSize(evt.rows);
      setOrdering(evt.sortField);
      setIncludeArchive(false);
      dispatch(searchMedicines(1, evt.rows, ordering, includeArchive, globalFilterValue, selectValue));
    }
    else if (useFetch) {
      setFirst(evt.first);
      setPage(page1);
      setPageSize(evt.rows);
      setOrdering(evt.sortField);
      setIncludeArchive(false);
      dispatch(fetchMedicines(page1, evt.rows, ordering, includeArchive, selectValue));
    }
    else if (globalFilterValue !== "") {
      setFirst(evt.first);
      setPage(page1);
      setPageSize(evt.rows);
      setOrdering(evt.sortField);
      setIncludeArchive(false);
      dispatch(searchMedicines(page1, evt.rows, ordering, includeArchive, globalFilterValue, selectValue));
    }
  };

  const handleModifyMedicineSave = () => {

    if (codeModified && codePrev !== modifyMedicineCode) {
      let found = false;

      codelist.forEach((element) => {
        if (element === modifyMedicineCode) found = true;
      });

      if (found) {
        showToast("error", "Virhe", "Lääke koodilla " + modifyMedicineCode + " on jo olemassa");
      }
    }
    if (barCodeModified && barCodePrev !== modifyBarCode) {
      let found = false;

      codelist.forEach((element) => {
        if (element === modifyBarCode)
          found = true;
      });

      if (found) {
        showToast("error", "Virhe", "Tarvike viivakoodilla " + modifyBarCode + " on jo olemassa");
      }
    }

    const modifiedMedicineObject = {
      code: modifyMedicineCode,
      name: modifyName,
      active_substance: modifyActiveSubstance,
      strength: modifyStrength,
      unit: modifyUnit,
      id: modifyId,
      vat_group: vatGroup,
      item_list: "https://awstest.provetcloud.com/7357/api/0.1/itemlist/1/",
      type_code: "2",
      price: modifyPrice,
      barcode: modifyBarCode,
      alert_level: modifyAlertLevel,
    };

    medicines.results.forEach((element) => {
      if (element.code !== "")
        localCodelist.push(element.code);

      if (element.barcode !== "")
        localBarCodelist.push(element.barcode);
    });

    setCodelist(localCodelist);
    setBarCodelist(localBarCodelist);

    dispatch(modifyMedicine(modifyId, modifiedMedicineObject));
    showToast(
      "success",
      "Tallennettu",
      "Lääke " + modifyName + " tallennettu onnistuneesti"
    );
    setModifyMedicineDialogOpen(false);
    handleCloseMedicineDialog();
    dispatch(
      searchMedicines(
        1,
        pageSize,
        ordering,
        includeArchive,
        modifyName,
        selectValue
      )
    );
  };
  const handleCloseMedicineDialog = () => {
    setModifyMedicineDialogOpen(false);
    setModifyName("");
    setModifyActiveSubstance("");
    setModifyStrength("");
    setModifyUnit("");
    setModifyId("");
    showToast('warn', 'Peruutettu', ' Muokkausta ei tallennettu.')
  };
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleClickOpenDelete = () => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleDeleteMedicine = () => {
    dispatch(deleteMedicine(modifyId));
    setOpenDeleteDialog(false);
    setModifyMedicineDialogOpen(false);
    showToast("success", "Poistettu ", modifyName + " onnistuneesti.");
    setPageNumber(1);
    dispatch(fetchMedicines(1, pageSize, "id", false, "", "name"));
  };

  const modifyMedicineDialog = () => {

    let ErrorMessage;
    let barCodeErrorMessage;

    let found = false;
    let barcodeFound = false;

    if (codeModified && codePrev !== modifyMedicineCode) {

      codelist.forEach((element) => {
        if (element === modifyMedicineCode)
          found = true;
      });

      if (found) {
        ErrorMessage = <Message severity="error" text={"Lääke koodilla " + modifyMedicineCode + " on jo olemassa"} style={{ marginTop: 2, width: "48.5%" }} />;
      }
    }

    if (barCodeModified && barCodePrev !== modifyBarCode) {

      barCodelist.forEach((element) => {
        if (element === modifyBarCode)
          barcodeFound = true;
      });

      if (barcodeFound) {
        if (found) {
          barCodeErrorMessage = <Message severity="error" text={"Lääke viivakoodilla " + modifyBarCode + " on jo olemassa"} style={{ marginTop: 2, width: "49%", marginLeft: "2.5%" }} />;
        }
        else {
          ErrorMessage = <Message style={{ background: 'none', marginTop: 2, width: "50.5%" }} className="border-primary w-full" severity="none" content={""} />;
          barCodeErrorMessage = <Message severity="error" text={"Lääke viivakoodilla " + modifyBarCode + " on jo olemassa"} style={{ marginTop: 2, width: "49.5%" }} />;
        }
      }
    }

    return (
      <Dialog open={modifyMedicineDialogOpen}>
        <DialogTitle>{"Muokkaa lääkettä"}</DialogTitle>
        <DialogContent>

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
              id="modifyMedicineCode"
              label="Koodi"
              variant="filled"
              sx={{
                backgroundColor: "white",
                borderRadius: 1,
              }}
              value={modifyMedicineCode}
              onChange={(e) => {
                setCodeModified(true);
                setModifyMedicineCode(e.target.value);
              }}
            />
            <TextField
              margin="normal"
              fullWidth
              id="modifyMedicineBarcode"
              label="Viivakoodi"
              variant="filled"
              sx={{
                backgroundColor: "white",
                borderRadius: 1,
              }}
              value={modifyBarCode}
              onChange={(e) => {
                setBarCodeModified(true);
                setModifiyBarCode(e.target.value);
              }}
            />
          </Box>

          {ErrorMessage}
          {barCodeErrorMessage}

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 2,
            }}
          >
            <TextField
              fullWidth
              sx={{
                backgroundColor: "white",
                borderRadius: 1,
                marginY: 2,
              }}
              id="modifyMedicineName"
              label="Nimi"
              variant="filled"
              value={modifyName}
              onChange={(e) => {
                setModifyName(e.target.value);
              }}
            />
            <TextField
              fullWidth
              sx={{
                backgroundColor: "white",
                borderRadius: 1,
                marginY: 2,
              }}
              id="modifyActiveSubstance"
              label="Vaikuttava aine"
              variant="filled"
              value={modifyActiveSubstance}
              onChange={(e) => {
                setModifyActiveSubstance(e.target.value);
              }}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 2,
            }}
          >
            <TextField
              fullWidth
              sx={{
                backgroundColor: "white",
                borderRadius: 1,
              }}
              id="modifyStrength"
              label="Vahvuus"
              variant="filled"
              value={modifyStrength}
              onChange={(e) => {
                setModifyStrength(e.target.value);
              }}
            />
            <FormControl fullWidth>
              <InputLabel variant="filled" required>
                Pakkausyksikkö
              </InputLabel>
              <Select
                variant="filled"
                value={modifyUnit}
                label="Yksikkö"
                style={{ backgroundColor: "#f0f0f0" }}
                onChange={handleModifyUnitChange}
                sx={{
                  borderRadius: 1,
                }}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: "200px",
                      backgroundColor: "#f0f0f0",
                      color: "black",
                    },
                  },
                }}
              >
                <MenuItem value="pcs">kpl</MenuItem>
                <MenuItem value="g">g</MenuItem>
                <MenuItem value="mg">mg</MenuItem>
                <MenuItem value="µg">µg</MenuItem>
                <MenuItem value="bottle">pullo</MenuItem>
                <MenuItem value="vial">näytepullo</MenuItem>
                <MenuItem value="ml">ml</MenuItem>
                <MenuItem value="tablet">tabletti</MenuItem>
                <MenuItem value="chew">purutabletti</MenuItem>
                <MenuItem value="box">paketti</MenuItem>

              </Select>
            </FormControl>
          </Box>
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
              id="price"
              label="Hinta"
              type="number"
              variant="filled"
              sx={{
                backgroundColor: "white",
                borderRadius: 1,
                marginBottom: 2,
              }}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              InputProps={{
                inputProps: { min: 0 },
                endAdornment: <InputAdornment position="end">€</InputAdornment>,
              }}
            />
            <TextField
              fullWidth
              sx={{
                backgroundColor: "white",
                borderRadius: 1,
                marginY: 2,
              }}
              id="modifyAlertLevel"
              label="Hälytystaso"
              variant="filled"
              value={modifyAlertLevel}
              onChange={(e) => {
                setModifiyAlertLevel(e.target.value);
              }}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 2,
              marginTop: "10px",
            }}
          >
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">ALV-ryhmä *</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                style={{ minWidth: "150px", backgroundColor: "#f0f0f0" }}
                sx={{
                  background: "white",
                  display: "flex",
                  flexDirection: "row",
                  gap: 2,
                }}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: "200px",
                      backgroundColor: "#f0f0f0",
                      color: "black",
                    },
                  },
                }}
                value={vatGroup}
                label="ALV-ryhmä *"
                onChange={(e) => setVatGroup(e.target.value)}
              >
                {vatGroups.results.map((vGroup, index) => (
                  <MenuItem value={vGroup.url}>{vGroup.title}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <IconButton
            id="deleteMedicine"
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
            <DialogTitle>{"Haluatko varmasti poistaa lääkkeen?"}</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Tätä toimintoa ei voi kumota.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                variant="contained"
                onClick={handleCloseDeleteDialog}
                color="info"
              >
                Peruuta
              </Button>
              <Button
                variant="contained"
                onClick={handleDeleteMedicine}
                color="warning"
              >
                Vahvista
              </Button>
            </DialogActions>
          </Dialog>
          <Button
            variant="contained"
            onClick={handleCloseMedicineDialog}
            color="warning"
          >
            Peruuta
          </Button>
          <Button
            variant="contained"
            onClick={handleModifyMedicineSave}
            color="success"
          >
            Vahvista
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const dateFormat = (dt) => {
    return new moment(dt).format("DD.MM.YYYY");
  };

  const renderHeader = () => {
    return (
      <Grid spacing={2} sx={{
        display:"flex",
        justifyContent:"space-between",
        "@media (max-width: 920px)": 
        {
          display:"flex",
          flexDirection:"column"
        }
        }}
      >
        <Grid item /*xs={4}*/ sx = {{
          "@media (max-width: 920px)": 
          {
            marginBottom:"10px"
          }
          }}
        >
          <Button
            type="button"
            variant="contained"
            size="large"
            color="primary"
            margin="normal"
            startIcon={<AddIcon />}
            onClick={() => {
              openAddMedicineDialogHandler(true);
            }}
          >
            Lisää uusi lääke
          </Button>
        </Grid>
        <Grid sx= {{
          display:"flex",
          flexDirection:"column",
          "@media (min-width: 401px)": 
          {
            display:"flex",
            flexDirection:"row",
          }
          }}
        >
          <Grid item /*xs={7}*/ sx = {{
            "@media (max-width: 400px)": 
            {
              marginTop:"10px",
              marginBottom:"5px"
            }
           }}
          >
            <span className="p-input-icon-left">
              <i className="pi pi-search" />
              <InputText
                value={globalFilterValue}
                onChange={onGlobalFilterChange}
                placeholder="Hae..."
                style={{ width: "100%" }}
              />

            </span>
          </Grid>
          <Grid item sx={{
            paddingLeft:"0px",
            "@media (min-width: 400px)": 
            {
              marginLeft:"5px"
            }
            }}
          >
            <Select
              label="Suodatin"
              size="small"
              sx={{ 
                height: "3rem",
                "@media (max-width: 400px)": 
                {
                  paddingRight:"0px",
                  width:"100px"
                }
              }}
              value={selectValue}
              onChange={selectValueHandler}
            >
              <MenuItem value="name">Nimi</MenuItem>
              <MenuItem value="code">Koodi</MenuItem>
            </Select>
          </Grid>
        </Grid>
      </Grid>
    );
  };

  const showToast = (severity, summary, detail) => {
    toast.current.show({ severity, summary, detail, life: 3000 });
  };
  const addMedicinesDialog = () => {

    let ErrorMessage;
    let found = false;
    let barCodeErrorMessage;
    let barCodeFound = false;

    codelist.forEach((element) => {
      if (element === code)
        found = true;
    });

    if (found) {
      ErrorMessage = <Message severity="error" text={"Lääke koodilla " + code + " on jo olemassa"} style={{ marginTop: 2, width: "49.5%" }} />;
    }

    barCodelist.forEach((element) => {
      if (element === barCode)
        barCodeFound = true;
    });

    if (barCodeFound) {
      if (found) {
        barCodeErrorMessage = <Message severity="error" text={"Lääke viivakoodilla " + barCode + " on jo olemassa"} style={{ marginTop: 2, width: "49.5%", marginLeft: "1%" }} />;
      }
      else {
        ErrorMessage = <Message style={{ background: 'none', marginTop: 2, width: "50.5%" }} className="border-primary w-full" severity="none" content={""} />;
        barCodeErrorMessage = <Message severity="error" text={"Lääke viivakoodilla " + barCode + " on jo olemassa"} style={{ marginTop: 2, width: "49.5%" }} />;
      }
    }

    return (
      <Dialog open={addMedicineDialogOpen} fullWidth={true} maxWidth={"xl"}>
        <DialogContent>
          <Box>
            <Typography variant="h5" color="white" sx={{ marginBottom: 3 }}>
              Lääkkeet
            </Typography>
            <Typography variant="subtitle1" color="white">
              Lisää uusi lääke
            </Typography>
            <Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 2,
                  "@media (max-width: 400px)": 
                  {
                    display:"flex",
                    flexDirection:"column",
                    marginBottom: -2,
                  }
                }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="code"
                  label="Koodi"
                  variant="filled"
                  sx={{
                    backgroundColor: "white",
                    borderRadius: 1,
                    "@media (max-width: 400px)": 
                    {
                    marginBottom: -3
                    }
                  }}
                  value={code}
                  onChange={(e) => { setCode(e.target.value) }}
                />
              </Box>
            </Box>



            <Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 2,
                }}
              >
                <div>
                <TextField
                margin="normal"
                required
                fullWidth
                id="barcode"
                label="Viivakoodi"
                variant="filled"
                sx={{
                backgroundColor: "white",
                borderRadius: 1
              }}
              value={barCode}
              onChange={(e) => { setBarCode(e.target.value) }}
              onFocus={startScanner}
              />
              <div id="scanner"></div>
              </div>
              </Box>

              {ErrorMessage}
              {barCodeErrorMessage}
            </Box>
            
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: 2,
                "@media (max-width: 400px)": 
                {
                  display:"flex",
                  flexDirection:"column",
                  marginBottom: -1,
                }
                }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Nimi"
                variant="filled"
                sx={{
                  backgroundColor: "white",
                  borderRadius: 1,
                  marginBottom: 2,
                  "@media (max-width: 400px)": 
                  {
                    marginBottom: -3
                  }
                }}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="price"
                label="Hinta"
                type="number"
                InputProps={{ 
                  inputProps: { 
                    min: 0 
                  } 
                }}
                variant="filled"
                sx={{
                  backgroundColor: "white",
                  borderRadius: 1,
                  marginBottom: 2,
                }}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                InputProps={{
                  inputProps: { min: 0 },
                  endAdornment: <InputAdornment position="end">€</InputAdornment>,
                }}
              />

            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: 2,
                "@media (max-width: 400px)": 
                {
                  display:"flex",
                  flexDirection:"column",
                  marginBottom: -1,
                }
              }}
            >
              <TextField
                required
                fullWidth
                id="strength"
                label="Vahvuus"
                variant="filled"
                sx={{
                  backgroundColor: "white",
                  borderRadius: 1,
                  "@media (max-width: 400px)": 
                  {
                    marginBottom: -1
                  }
                }}
                value={strength}
                onChange={(e) => setStrength(e.target.value)}
              />
              <FormControl fullWidth>
                <InputLabel variant="filled" required>
                  Pakkausyksikkö
                </InputLabel>
                <Select
                  variant="filled"
                  value={unit}
                  label="Pakkausyksikkö"
                  style={{ backgroundColor: "#f0f0f0" }}
                  onChange={handleUnitChange}
                  sx={{
                    borderRadius: 1,
                  }}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: "200px",
                        backgroundColor: "#f0f0f0",
                        color: "black",
                      },
                    },
                  }}
                >
                  <MenuItem value="pcs">kpl</MenuItem>
                  <MenuItem value="g">g</MenuItem>
                  <MenuItem value="mg">mg</MenuItem>
                  <MenuItem value="µg">µg</MenuItem>
                  <MenuItem value="bottle">pullo</MenuItem>
                  <MenuItem value="vial">näytepullo</MenuItem>
                  <MenuItem value="ml">ml</MenuItem>
                  <MenuItem value="tablet">tabletti</MenuItem>
                  <MenuItem value="chew">purutabletti</MenuItem>
                  <MenuItem value="box">paketti</MenuItem>

                </Select>
              </FormControl>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: 2,
                "@media (max-width: 400px)": 
                {
                  display:"flex",
                  flexDirection:"column",
                  marginBottom: -1,
                }
              }}
            >

              <TextField
                margin="normal"
                required
                fullWidth
                id="active_substance"
                label="Vaikuttava aine"
                variant="filled"
                sx={{
                  backgroundColor: "white",
                  borderRadius: 1,
                  marginBottom: 2,
                  "@media (max-width: 400px)": 
                  {
                    marginBottom: -3
                  }
                }}
                value={activeSubstance}
                onChange={(e) => setActiveSubstance(e.target.value)}
              />

              <TextField
                margin="normal"
                fullWidth
                sx={{
                  backgroundColor: "white",
                  borderRadius: 1,
                  marginBottom: 2,
                }}
                id="alertLevel"
                label="Hälytystaso"
                variant="filled"
                type="number"
                value={alert_level}
                onChange={(e) => {
                  setAlertLevel(e.target.value);
                }}
                InputProps={{
                  inputProps: { min: 0 },
                }}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: 2,
                "@media (max-width: 400px)": 
                {
                  display:"flex",
                  flexDirection:"column",
                  marginBottom: -1,
                }
              }}
            >
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  ALV-ryhmä *
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  style={{ minWidth: "150px", backgroundColor: "#f0f0f0" }}
                  sx={{
                    background: "white",
                    display: "flex",
                    flexDirection: "row",
                    gap: 2,
                  }}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: "200px",
                        backgroundColor: "#f0f0f0",
                        color: "black",
                      },
                    },
                  }}
                  value={vatGroup}
                  label="ALV-ryhmä *"
                  onChange={(e) => setVatGroup(e.target.value)}
                >
                  {vatGroups.results.map((vGroup, index) => (
                    <MenuItem value={vGroup.url}>{vGroup.title}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <ConnectionStatus>
            </ConnectionStatus>
            <Button
              id="add_medicine"
              type="submit"
              variant="contained"
              size="large"
              color="success"
              margin="normal"
              sx={{ 
                height: 56, 
                minWidth: 100, 
                marginTop: 2,
              }}
              startIcon={<AddIcon />}
              onClick={() => {
                handleSave();
              }}
              disabled={!validateForm()}
            >
              Lisää
            </Button>
            <Button
              id="cancel_add_medicine"
              type="submit"
              variant="contained"
              size="large"
              color="warning"
              margin="large"
              sx={{ height: 56, minWidth: 100, marginTop: 2, marginLeft: 2 }}
              onClick={() => {
                closeAddMedicineDialogHandler();
              }}
            >
              Peruuta
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    );
  };
  const header = renderHeader();

  const openAddMedicineDialogHandler = () => {
    setAddMedicineDialogOpen(true);
  };
  const closeAddMedicineDialogHandler = () => {
    setCode("");
    setName("");
    setUnit("");
    setStrength("");
    setActiveSubstance("");
    setAlertLevel(0);
    setPrice(0.0);
    setBarCode("");
    setVatGroup("");
    setAddMedicineDialogOpen(false);
  };

  const evalVatGroup = (row) => {
    let vat_group = vatGroups.results.find((vat) => vat.url === row.vat_group);
    return vat_group?.title;
  };

  return (
    <Box>
      <Typography variant="h5" color="white" sx={{ marginBottom: 3 }}>
        Lääkkeet
      </Typography>

      <Typography
        variant="subtitle1"
        color="white"
        sx={{ marginTop: 4, marginBottom: 2 }}
      >
        Muokkaa tai poista lääkkeitä
      </Typography>
      <Box>

        <DataTable
          value={medicines.results}
          stripedRows
          rows={pageSize}
          dataKey="id"
          header={header}
          emptyMessage="Ei löytynyt."
          scrollHeight="400px"
          lazy
          first={first}
          responsiveLayout="scroll"
          totalRecords={totalRecords}
          loading={loading.loading}
        >
          <Column field="id" header="ID" align={"center"}></Column>
          <Column field="code" header="Koodi" align={"center"}></Column>
          <Column field="barcode" header="Viivakoodi" align={"center"}></Column>
          <Column field="name" header="Nimi" align={"center"}></Column>
          <Column field="price" header="Hinta" align={"center"}></Column>
          <Column
            field="active_substance"
            header="Vaikuttava aine"
            align={"center"}
          ></Column>
          <Column field="strength" header="Vahvuus" align={"center"}></Column>
          <Column field="unit" header="Pakkausyksikkö" align={"center"}></Column>
          <Column
            field="created"
            header="Luotu"
            align={"center"}
            body={dateFormat}
          ></Column>
          <Column
            field="modified"
            header="Muokattu"
            align={"center"}
            body={dateFormat}
          ></Column>
          <Column field="alert_level" header="Hälytystaso" align={"center"}></Column>

          <Column
            field="vat_group"
            header="ALV-ryhmä"
            body={evalVatGroup}
          ></Column>
          <Column
            key="edit"
            body={(rowData) => (
              <IconButton
                id="modifyMedicine"
                sx={{
                  color: "grey",
                }}
                size="small"
                onClick={() => {
                  setModifyMedicineCode(rowData.code);
                  setCodeprev(rowData.code);
                  setModifiyBarCode(rowData.barcode);
                  setBarCodeprev(rowData.barcode);

                  setModifyName(rowData.name);
                  setModifyActiveSubstance(rowData.active_substance);
                  setModifyStrength(rowData.strength);
                  setModifyUnit(rowData.unit);
                  setModifyId(rowData.id);
                  setModifyPrice(rowData.price);
                  setModifiyAlertLevel(rowData.alert_level);
                  setVatGroup(rowData.vat_group);
                  setModifyMedicineDialogOpen(true);
                }}
              >
                <CreateIcon></CreateIcon>
              </IconButton>
            )}
          />
        </DataTable>
        <Paginator
          first={first}
          rows={pageSize}
          totalRecords={totalRecords}
          rowsPerPageOptions={[5, 10, 25, 50]}
          onPageChange={onPageEvent}
        />
      </Box>
      {modifyMedicineDialog()}
      {addMedicinesDialog()}
      <Toast ref={toast} />
    </Box>
  );
};

export default ManageMedicines;