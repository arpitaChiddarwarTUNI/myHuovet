import { Box } from "@mui/system";
import "./ComponentsStylesheet.css"
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
  IconButton,
  FormControl,
  Grid,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CreateIcon from "@mui/icons-material/Create";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import InputAdornment from "@mui/material/InputAdornment";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import React, { useRef, useState, useEffect } from "react";
import { Toast } from "primereact/toast";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSupplies,
  addSupply,
  modifySupply,
  deleteSupply,
} from "../store/features/supplySlice";
import { fetchVatGroups } from "../store/features/vatGroupSlice.js";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Message } from "primereact/message";
import Quagga from 'quagga';

const ManageSupplies = () => {
  const [code, setCode] = useState("");
  const [barcode, setBarcode] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState("");
  const [unit, setUnit] = useState("");
  const [alertlevel, setAlertlevel] = useState("");
  const [vatgroup, setVatgroup] = useState("");
  const [vatgroupslist, setVatgroupslist] = useState([]);

  const [codelist, setCodelist] = useState([]);
  const [codeModified, setCodeModified] = useState(false);
  const [codePrev, setCodeprev] = useState("");

  const [barCodelist, setBarCodelist] = useState([]);
  const [barCodeModified, setBarCodeModified] = useState(false);
  const [barCodePrev, setBarCodeprev] = useState("");

  const [addSupplyDialogOpen, setAddSupplyDialogOpen] = useState(false);
  const [modifySupplyDialogOpen, setModifySupplyDialogOpen] = useState(false);

  const [modifySupplyName, setModifySupplyName] = useState("");
  const [modifySupplyPrice, setModifySupplyPrice] = useState("");
  const [modifySupplyType, setModifySupplyType] = useState("");
  const [modifySupplyUnit, setModifySupplyUnit] = useState("");
  const [modifySupplyId, setModifySupplyId] = useState("");
  const [modifySupplyCode, setModifySupplyCode] = useState("");
  const [modifySupplyBarcode, setModifySupplyBarcode] = useState("");
  const [modifySupplyAlertlevel, setModifySupplyAlertlevel] = useState("");
  const [modifySupplyVatgroup, setModifySupplyVatgroup] = useState("");

  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [pageSize, setPageSize] = useState(5);
  const [pageNumber, setPageNumber] = useState(1);

  const [selectValue, setSelectValue] = useState("name");

  const toast = useRef(null);

  const dispatch = useDispatch();
  const supplies = useSelector((state) => state.supplies);
  const vatgroups = useSelector((state) => state.vatGroups);

  const [changePage, setchangePage] = useState(0);  

  const showToast = (severity, summary, detail) => {
    toast.current.show({
      severity,
      summary,
      detail,
      life: 3000,
    });
  };

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
      setBarcode(result.codeResult.code);
      Quagga.stop();
    });
  }

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    setPageNumber(1);
    setchangePage(1);

    if (value && value === "") {
      dispatch(fetchSupplies(1, pageSize, "id", false, "", selectValue));
      clearFilter();
    } else {
      dispatch(fetchSupplies(1, pageSize, "id", false, value, selectValue));
      setGlobalFilterValue(value);
    }
  };

  const selectValueHandler = (event) => {
    setSelectValue(event.target.value);
    dispatch(fetchSupplies(pageNumber, pageSize, "id", false, globalFilterValue, event.target.value));
  };

  const clearFilter = () => {
    setGlobalFilterValue("");
  };

  useEffect(() => {
    dispatch(fetchVatGroups());
    setVatgroupslist(vatgroups.results);
    dispatch(fetchSupplies(1, 100, "", false, "", "name"));

    supplies.results.forEach((element) => {
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

      if (element === barcode) 
        barcodeFound = true;
    });

    if (found) {
      showToast( "error", "Virhe", "Toimitus koodilla " + code + " on jo olemassa" );
    } 
    if (barcodeFound) {
      showToast( "error", "Virhe", "Tarvike viivakoodilla " + barcode + " on jo olemassa" );
    } 
    else {
      let typeC = "";

      if (type === "medicine") {
        typeC = "1";
      } else if (type === "food") {
        typeC = "2";
      } else {
        typeC = "3";
      }

      const supplyObject = {
        code: code,
        barcode: barcode,
        name: name,
        price: parseFloat(price),
        alert_level: parseFloat(alertlevel),
        type_code: typeC,
        unit: unit,
        item_list: "https://awstest.provetcloud.com/7357/api/0.1/itemlist/1/",
        vat_group: "https://awstest.provetcloud.com/7357/api/0.1/vatgroup/" + vatgroup + "/",
      };

      localCodelist = codelist;
      localCodelist.push(supplyObject.code);
      setCodelist(localCodelist);

      localBarCodelist = barCodelist;
      localBarCodelist.push(supplyObject.barcode);
      setBarCodelist(localBarCodelist);

      dispatch(addSupply(supplyObject));
      showToast("success", "Menestys", "Uusi tarjonta lisätty onnistuneesti");
      setCode("");
      setBarcode("");
      setName("");
      setPrice("");
      setAlertlevel("");
      setVatgroup("");
      setType("");
      setUnit("");
      setPageNumber(1);
      dispatch(fetchSupplies(1, pageSize, "id", false, "", "name"));
    }
  };

  const handleUnitChange = (event) => {
    setUnit(event.target.value);
  };

  const handleTypeChange = (event) => {
    setType(event.target.value);
  };

  const handleVatgroupChange = (event) => {
    setVatgroup(event.target.value);
  };

  const handleModifyVatgroupChange = (event) => {
    setModifySupplyVatgroup(event.target.value);
  };

  const handleModifyUnitChange = (event) => {
    setModifySupplyUnit(event.target.value);
  };

  const handleModifyTypeChange = (event) => {
    setModifySupplyType(event.target.value);
  };

  const totalRecords = supplies.count;

  const onPageEvent = (evt) => {
    setPageSize(evt.rows);
    setPageNumber(evt.first);
    dispatch(fetchSupplies(evt.page + 1, evt.rows, evt.sortField, false, globalFilterValue));
  };

  const handleModifySupplySave = () => {
    if (codeModified && codePrev !== modifySupplyCode) {
      let found = false;

      codelist.forEach((element) => {
        if (element === modifySupplyCode) found = true;
      });

      if (found) {
        showToast( "error", "Virhe", "Toimitus koodilla " + modifySupplyCode + " on jo olemassa" );
      } else {
        let type = "";

        if (modifySupplyType === "medicine") {
          type = "1";
        } else if (modifySupplyType === "food") {
          type = "2";
        } else {
          type = "3";
        }

        const modifiedSupplyObject = {
          code: modifySupplyCode,
          barcode: modifySupplyBarcode,
          name: modifySupplyName,
          price: parseFloat(modifySupplyPrice),
          alert_level: parseFloat(modifySupplyAlertlevel),
          type_code: type,
          unit: modifySupplyUnit,
          item_list: "https://awstest.provetcloud.com/7357/api/0.1/itemlist/1/",
          vat_group: "https://awstest.provetcloud.com/7357/api/0.1/vatgroup/" + modifySupplyVatgroup + "/",
        };

        dispatch(modifySupply(modifiedSupplyObject, modifySupplyId));
        showToast( "success", "Muokattu", "Tarvikkeen " + modifySupplyName + " muokkaaminen onnistui" );
        setModifySupplyDialogOpen(false);
        setPageNumber(1);
        dispatch(fetchSupplies(1, pageSize, "id", false, "", "name"));
      }
    } 
    if (barCodeModified && barCodePrev !== modifySupplyBarcode) {
      let found = false;

      codelist.forEach((element) => {
        if (element === modifySupplyBarcode) 
          found = true;
      });

      if (found) {
        showToast( "error", "Virhe", "Tarvike viivakoodilla " + modifySupplyBarcode + " on jo olemassa" );
      } 
      else {
        let type = "";

        if (modifySupplyType === "medicine") {
          type = "1";
        } else if (modifySupplyType === "food") {
          type = "2";
        } else {
          type = "3";
        }

        const modifiedSupplyObject = {
          code: modifySupplyCode,
          barcode: modifySupplyBarcode,
          name: modifySupplyName,
          price: parseFloat(modifySupplyPrice),
          alert_level: parseFloat(modifySupplyAlertlevel),
          type_code: type,
          unit: modifySupplyUnit,
          item_list: "https://awstest.provetcloud.com/7357/api/0.1/itemlist/1/",
          vat_group: "https://awstest.provetcloud.com/7357/api/0.1/vatgroup/" + modifySupplyVatgroup + "/",
        };

        dispatch(modifySupply(modifiedSupplyObject, modifySupplyId));
        showToast( "success", "Muokattu", "Tarvikkeen " + modifySupplyName + " muokkaaminen onnistui" );
        setModifySupplyDialogOpen(false);
        setPageNumber(1);
        dispatch(fetchSupplies(1, pageSize, "id", false, "", "name"));
      }
    } 
    else {
      let type = "";

      if (modifySupplyType === "medicine") {
        type = "1";
      } else if (modifySupplyType === "food") {
        type = "2";
      } else {
        type = "3";
      }

      const modifiedSupplyObject = {
        code: modifySupplyCode,
        barcode: modifySupplyBarcode,
        name: modifySupplyName,
        price: parseFloat(modifySupplyPrice),
        alert_level: parseFloat(modifySupplyAlertlevel),
        type_code: type,
        unit: modifySupplyUnit,
        item_list: "https://awstest.provetcloud.com/7357/api/0.1/itemlist/1/",
        vat_group: "https://awstest.provetcloud.com/7357/api/0.1/vatgroup/" + modifySupplyVatgroup + "/",
      };

      dispatch(modifySupply(modifiedSupplyObject, modifySupplyId));
      showToast( "success", "Muokattu", "Tarvikkeen " + modifySupplyName + " muokkaaminen onnistui" );
      setModifySupplyDialogOpen(false);
      setPageNumber(1);
      dispatch(fetchSupplies(1, pageSize, "id", false, "", "name"));
    }
  };

  const handleCloseSupplyDialog = () => {
    setModifySupplyDialogOpen(false);
  };

  const validateForm = () => {
    return (
      code !== "" && name.length > 0 && price > 0 && type !== "" && unit !== ""
    );
  };

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleClickOpenDelete = () => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleDeleteSupply = () => {
    dispatch(deleteSupply(modifySupplyId));
    showToast( "success", "Poistettu", "Tarvikkeen " + modifySupplyName + " poistaminen onnistui" );
    setOpenDeleteDialog(false);
    setModifySupplyDialogOpen(false);
    setPageNumber(1);
    dispatch(fetchSupplies(1, pageSize, "id", false, "", "name"));
  };

  const getType = (type) => {
    if (type === 1) {
      setModifySupplyType("medicine");
    } else if (type === 2) {
      setModifySupplyType("food");
    } else {
      setModifySupplyType("other");
    }
  };

  const getVatgroup = (url) => {
    vatgroupslist.forEach((item) => {
      if (item.url === url) {
        let last3 = item.url.slice(-3);
        let id = last3.slice(0, -1);

        setModifySupplyVatgroup(id);
      }
    });
  };

  const modifySupplyDialog = () => {

    let ErrorMessage;
    let barCodeErrorMessage;

    let found = false;
    let barcodeFound = false;
    
    if (codeModified && codePrev !== modifySupplyCode) {
  
      codelist.forEach((element) => {
        if (element === modifySupplyCode) 
          found = true;
      });

      if (found) {
        ErrorMessage = <Message severity="error" text={"Toimitus koodilla " + modifySupplyCode + " on jo olemassa"} style={{ marginTop: 2, width: "48.5%" }} />;
      }
    }
    
    if (barCodeModified && barCodePrev !== modifySupplyBarcode) {

      barCodelist.forEach((element) => {
        if (element === modifySupplyBarcode) 
        barcodeFound = true;
      });
      
      if (barcodeFound) {
        if(found)
        {
          barCodeErrorMessage = <Message severity="error" text={"Tarvike viivakoodilla " + modifySupplyBarcode + " on jo olemassa"} style={{ marginTop: 2, width: "49%", marginLeft: "2.5%" }} />;
        }
        else
        {
          ErrorMessage = <Message style={{ background: 'none', marginTop: 2, width: "50.5%" }} className="border-primary w-full" severity="none" content={""} />;
          barCodeErrorMessage = <Message severity="error" text={"Tarvike viivakoodilla " + modifySupplyBarcode + " on jo olemassa"} style={{ marginTop: 2, width: "49.5%" }} />;
        }
      }
    }

    return (
      <Dialog open={modifySupplyDialogOpen}>
        <DialogTitle>{"Muokkaa tarviketta"}</DialogTitle>
        <DialogContent>
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
                marginY: 1,
              }}
              id="modifySupplyCode"
              label="Koodi"
              variant="filled"
              value={modifySupplyCode}
              onChange={(e) => {
                setModifySupplyCode(e.target.value);
                setCodeModified(true);
              }}
            />

            <TextField
              fullWidth
              sx={{
                backgroundColor: "white",
                borderRadius: 1,
                marginY: 1,
              }}
              id="modifySupplyBarcode"
              label="Viivakoodi"
              variant="filled"
              value={modifySupplyBarcode}
              onChange={(e) => {   
                setModifySupplyBarcode(e.target.value);
                setBarCodeModified(true)
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
                marginY: 1,
              }}
              id="modifySupplyAlertlevel"
              label="Hälytystaso"
              variant="filled"
              type="number"
              value={modifySupplyAlertlevel}
              onChange={(e) => {
                setModifySupplyAlertlevel(e.target.value);
              }}
              InputProps={{
                inputProps: { min: 0 },
              }}
            />

            <FormControl fullWidth>
              <InputLabel variant="filled" required>
                {" "}
                Alv-ryhmä{" "}
              </InputLabel>
              <Select
                variant="filled"
                value={modifySupplyVatgroup}
                label="Alv-ryhmä"
                style={{ backgroundColor: "#f0f0f0" }}
                onChange={handleModifyVatgroupChange}
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
                {vatgroupslist.map((item) => {
                  let id = "";
                  let last3 = item.url.slice(-3);
                  id = last3.slice(0, -1);

                  return (
                    <MenuItem key={id} value={id}>
                      {item.title}
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
            }}
          >
            <TextField
              fullWidth
              sx={{
                backgroundColor: "white",
                borderRadius: 1,
                marginY: 1,
              }}
              id="modifySupplyName"
              label="Nimi"
              variant="filled"
              value={modifySupplyName}
              onChange={(e) => {
                setModifySupplyName(e.target.value);
              }}
            />
            <TextField
              fullWidth
              sx={{
                backgroundColor: "white",
                borderRadius: 1,
                marginY: 1,
              }}
              id="modifySupplyPrice"
              label="Hinta"
              variant="filled"
              type="number"
              value={modifySupplyPrice}
              onChange={(e) => {
                setModifySupplyPrice(e.target.value);
              }}
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
            }}
          >
            <FormControl fullWidth>
              <InputLabel variant="filled" required>
                Tyyppi
              </InputLabel>
              <Select
                variant="filled"
                value={modifySupplyType}
                label="Tyyppi"
                style={{ backgroundColor: "#f0f0f0" }}
                onChange={handleModifyTypeChange}
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
                <MenuItem value="medicine">Lääke</MenuItem>
                <MenuItem value="food">Ruoka</MenuItem>
                <MenuItem value="other">Muu</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel variant="filled" required>
                Yksikkö
              </InputLabel>
              <Select
                variant="filled"
                value={modifySupplyUnit}
                label="Yksikkö"
                style={{ backgroundColor: "#f0f0f0" }}
                onChange={handleModifyUnitChange}
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
                <MenuItem value="pcs">kpl</MenuItem>
                <MenuItem value="g">g</MenuItem>
                <MenuItem value="ml">ml</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <IconButton
            id="deleteSupply"
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
            <DialogTitle>{"Haluatko varmasti poistaa tarvikkeen?"}</DialogTitle>
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
                onClick={handleDeleteSupply}
                color="warning"
              >
                Poista
              </Button>
            </DialogActions>
          </Dialog>
          <Button
            variant="contained"
            onClick={handleCloseSupplyDialog}
            color="warning"
          >
            Peruuta
          </Button>
          <Button
            variant="contained"
            onClick={handleModifySupplySave}
            color="success"
            disabled={
              modifySupplyCode === "" ||
              modifySupplyBarcode === "" ||
              modifySupplyName === "" ||
              modifySupplyPrice === "" ||
              modifySupplyVatgroup === "" ||
              modifySupplyAlertlevel === "" ||
              modifySupplyType === "" ||
              modifySupplyUnit === ""
            }
          >
            Vahvista
          </Button>
        </DialogActions>
      </Dialog>
    );
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
              openAddSupplyDialogHandler(true);
            }}
          >
            Lisää uusi tarvike
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
          <Grid item /*xs={6.5}*/ sx = {{
            "@media (max-width: 400px)": 
            {
              marginTop:"10px",
              marginBottom:"5px",
              display:"flex",
              justifyContent:"left"
            }
           }}
          >
            <span className="p-input-icon-left" style={{ float: "right" }}>
              <i className="pi pi-search" />
              <InputText
                value={globalFilterValue}
                onChange={onGlobalFilterChange}
                placeholder="Hae..."
                style={{ width: "100%" }}
              />
            </span>
          </Grid>
          <Grid item /*xs={1}*/ sx={{
            paddingLeft:"0px",
            "@media (min-width: 400px)": 
            {
              marginLeft:"5px"
            }
            }}
          >
            <Select
              label="Filter"
              size="small"
              sx={{ 
                height: "3rem",
                "@media (max-width: 400px)": 
                {
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

  const openAddSupplyDialogHandler = () => {
    setAddSupplyDialogOpen(true);
  };
  const closeAddSupplyDialogHandler = () => {
    setAddSupplyDialogOpen(false);
  };

  const addSuppliesDialog = () => {

    let ErrorMessage;
    let found = false;
    let barCodeErrorMessage;
    let barCodeFound = false;

    codelist.forEach((element) => {
      if (element === code) 
        found = true;
    });

    if (found) {
      ErrorMessage = <Message severity="error" text={"Toimitus koodilla " + code + " on jo olemassa"} style={{ marginTop: 2, width: "49.5%" }} />;
    }

    barCodelist.forEach((element) => {
      if (element === barcode) 
        barCodeFound = true;
    });

    if (barCodeFound) {
      if(found)
      {
        barCodeErrorMessage = <Message severity="error" text={"Tarvike viivakoodilla " + barcode + " on jo olemassa"} style={{ marginTop: 2, width: "49.5%", marginLeft: "1%" }} />;
      }
      else
      {
        ErrorMessage = <Message style={{ background: 'none', marginTop: 2, width: "50.5%" }} className="border-primary w-full" severity="none" content={""} />;
        barCodeErrorMessage = <Message severity="error" text={"Tarvike viivakoodilla " + barcode + " on jo olemassa"} style={{ marginTop: 2, width: "49.5%" }} />;
      }
    }

    return (
      <Dialog open={addSupplyDialogOpen} fullWidth={true} maxWidth={"xl"}>
        <DialogContent>
          <Box>
            <Typography variant="h5" color="white" sx={{ marginBottom: 3 }}>
              Tarvikkeet
            </Typography>
            <Typography variant="subtitle1" color="white">
              Lisää uusi tarvike
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
                    marginBottom: -1,
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
                    marginBottom: 0,
                    "@media (max-width: 400px)": 
                    {
                    marginBottom: -3
                    }
                  }}
                  value={code}
                  onChange={(e) => { setCode(e.target.value) }}
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
                  marginBottom: -2,
                }
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
                  borderRadius: 1,
                }}
                value={barcode}
                onChange={(e) => { setBarcode(e.target.value) }}
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
              }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                type="number"
                id="alertlevel"
                label="Hälytystaso"
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
                value={alertlevel}
                onChange={(e) => setAlertlevel(e.target.value)}
                InputProps={{
                  inputProps: { min: 0 },
                }}
              />

              <FormControl fullWidth margin="normal">
                <InputLabel variant="filled" required>
                  {" "}
                  Alv ryhmä{" "}
                </InputLabel>
                <Select
                  variant="filled"
                  value={vatgroup}
                  label="Alv ryhmä"
                  style={{ backgroundColor: "#f0f0f0" }}
                  onChange={handleVatgroupChange}
                  sx={{
                    borderRadius: 1,
                    marginBottom: 0,
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
                  {vatgroupslist.map((item) => {
                    let id = "";
                    let last3 = item.url.slice(-3);
                    id = last3.slice(0, -1);

                    return (
                      <MenuItem key={id} value={id}>
                        {item.title}
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
                  endAdornment: (
                    <InputAdornment position="end">€</InputAdornment>
                  ),
                }}
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: 2,
                alignItems: "center",
                "@media (max-width: 400px)": 
                {
                  display:"flex",
                  flexDirection:"column",
                  marginBottom: -1,
                }
              }}
            >
              <FormControl fullWidth>
                <InputLabel variant="filled" required>
                  Tyyppi
                </InputLabel>
                <Select
                  variant="filled"
                  value={type}
                  label="Tyyppi"
                  style={{ backgroundColor: "#f0f0f0" }}
                  onChange={handleTypeChange}
                  sx={{
                    borderRadius: 1,
                    "@media (max-width: 400px)": 
                    {
                    marginBottom: -1
                    }
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
                  <MenuItem value="medicine">Lääke</MenuItem>
                  <MenuItem value="food">Ruoka</MenuItem>
                  <MenuItem value="other">Muu</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel variant="filled" required>
                  Yksikkö
                </InputLabel>
                <Select
                  variant="filled"
                  value={unit}
                  label="Yksikkö"
                  style={{ backgroundColor: "#f0f0f0" }}
                  onChange={handleUnitChange}
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
                  <MenuItem value="pcs">kpl</MenuItem>
                  <MenuItem value="g">g</MenuItem>
                  <MenuItem value="ml">ml</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Button
              id="add_supply"
              type="submit"
              variant="contained"
              size="large"
              color="success"
              margin="normal"
              sx={{ height: 56, marginTop: 2 }}
              startIcon={<AddIcon />}
              onClick={() => {
                handleSave();
              }}
              disabled={!validateForm()}
            >
              Lisää
            </Button>
            <Button
              id="cancel_add_supply"
              type="submit"
              variant="contained"
              size="large"
              color="warning"
              margin="large"
              sx={{ height: 56, minWidth: 100, marginTop: 2, marginLeft: 2 }}
              onClick={() => {
                closeAddSupplyDialogHandler();
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

  return (
    <Box>
      <Typography variant="h5" color="white" sx={{ marginBottom: 3 }}>
        Tarvikkeet
      </Typography>

      <Typography
        variant="subtitle1"
        color="white"
        sx={{ marginTop: 4, marginBottom: 2 }}
      >
        Muokkaa tai poista tarvikkeita
      </Typography>

      <Box>
        <DataTable
          value={supplies.results}
          stripedRows
          paginator
          rows={pageSize}
          rowsPerPageOptions={[5, 10, 25, 50]}
          rowHover={true}
          sortField="name"
          removableSort
          dataKey="id"
          header={header}
          emptyMessage="Ei löytynyt."
          lazy
          first={pageNumber}
          responsiveLayout="scroll"
          totalRecords={totalRecords}
          onPage={onPageEvent}
          onRowClick={() => modifySupplyDialog}
        >
          <Column field="id" header="ID"></Column>
          <Column field="code" header="Koodi"></Column>
          <Column field="barcode" header="Viivakoodi"></Column>
          <Column field="name" header="Nimi"></Column>
          <Column field="alert_level" header="Hälytystaso"></Column>
          <Column field="price" header="Hinta €"></Column>
          <Column
            field="type"
            header="Tyyppi"
            body={(rowData) => {
              if (rowData.type_code === 1) {
                return "medicine";
              } else if (rowData.type_code === 2) {
                return "food";
              } else {
                return "other";
              }
            }}
          ></Column>
          <Column field="unit" header="Yksikkö"></Column>
          <Column
            field="vatgroup"
            header="Alv-ryhmä"
            body={(rowData) => {
              let title = "";
              vatgroupslist.forEach((item) => {
                if (item.url === rowData.vat_group) {
                  title = item.title;
                }
              });
              return title;
            }}
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
                  setModifySupplyCode(rowData.code);
                  setCodeprev(rowData.code);
                  setModifySupplyBarcode(rowData.barcode);
                  setBarCodeprev(rowData.barcode);
                  setModifySupplyDialogOpen(true);
                  setModifySupplyName(rowData.name);
                  setModifySupplyPrice(rowData.price);
                  setModifySupplyAlertlevel(rowData.alert_level);
                  getVatgroup(rowData.vat_group);
                  getType(rowData.type_code);
                  setModifySupplyUnit(rowData.unit);
                  setModifySupplyId(rowData.id);
                }}
              >
                <CreateIcon></CreateIcon>
              </IconButton>
            )}
          />
        </DataTable>
      </Box>

      {modifySupplyDialog()}
      {addSuppliesDialog()}
      <Toast ref={toast} />
    </Box>
  );
};

export default ManageSupplies;