import { Box } from "@mui/system";
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
  DialogTitle,
  Grid,
  FormControlLabel,
  Checkbox,
  FormGroup,
} from "@mui/material";
import dayjs from "dayjs";
import CreateIcon from "@mui/icons-material/Create";
import AddIcon from '@mui/icons-material/Add';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import React, { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import { fetchItems, saveItem, searchItems, addToStock } from "../store/features/itemSlice";
import moment from "moment";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { GetItemTypes } from "../constants/ItemTypes";
import { DateTimePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { fetchVatGroups, getVatGroups } from "../store/features/vatGroupSlice";
import { fetchInvoiceGroups } from "../store/features/invoiceGroupSlice";
import { fetchItemLists } from "../store/features/itemListSlice";
import { setLoader } from "../store/features/loadingSlice";
import axios from "axios";
import { Toast } from 'primereact/toast';

const ManageItems = () => {
  const [itemId, setItemId] = useState(0);
  const [code, setCode] = useState("");
  const [barcode, setBarcode] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [name, setName] = useState("");
  const [printName, setPrintName] = useState("");
  const [hideOnConsultation, setHideOnConsultation] = useState(false);
  const [price, setPrice] = useState(0);
  const [priceWithVat, setPriceWithVat] = useState(0);
  const [minimumPrice, setMinimumPrice] = useState(0);
  const [minimumPriceWithVat, setMinimumPriceWithVat] = useState(0);
  const [wholeSalePrice, setWholeSalePrice] = useState(0);
  const [wholesaleDiscount, setWholesaleDiscount] = useState(0);
  const [producerDiscount, setProducerDiscount] = useState(0);
  const [specialDiscount, setSpecialDiscount] = useState(0);
  const [marginPercent, setMarginPercent] = useState(0);
  const [vatGroup, setVatGroup] = useState();
  const [invoiceGroup, setInvoiceGroup] = useState(0);
  const [itemList, setItemList] = useState(0);
  const [type, setType] = useState(0);
  const [parentAmount, setParentAmount] = useState(0);
  const [instructions, setInstructions] = useState("");
  const [archived, setArchived] = useState(false);
  const [archivedDate, setArchivedDate] = React.useState(
    //    dayjs("2014-08-18T21:11:54")
    dayjs()
  );
  const [expiryDate, setExpiryDate] = React.useState(
    //    dayjs("2014-08-18T21:11:54")
    // dayjs()
  );
  const [excludeDiscount, setExcludeDiscount] = useState(false);
  const [hideZeroPrint, setHideZeroPrint] = useState(false);
  const [performedByRule, setPerformedByRule] = useState(0);
  const [hideOnCountersaleSearch, setHideOnCountersaleSearch] = useState(false);
  const [royaltyFee, setRoyaltyFee] = useState(0);
  const [externalReportingCode, setExternalReportingCode] = useState(0);
  const [externalReportingCode2, setExternalReportingCode2] = useState(0);
  const [externalReportingCode3, setExternalReportingCode3] = useState(0);
  const [hideOnConsulationSearch, setHideOnConsulationSearch] = useState(false);
  const [
    disableAutomaticSellingPriceCalculation,
    setDisableAutomaticSellingPriceCalculation,
  ] = useState(false);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [addItemDialogOpen, setAddItemDialogOpen] = useState(false);
  const [first, setFirst] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [ordering, setOrdering] = useState('name');
  const [includeArchive, setIncludeArchive] = useState(false);
  const [selectValue, setSelectValue] = useState(2);
  const dispatch = useDispatch();
  const items = useSelector((state) => state.items);
  const vatGroups = useSelector((state) => state.vatGroups);
  const invoiceGroups = useSelector((state) => state.invoiceGroups);
  const itemLists = useSelector((state) => state.itemLists);
  const loading = useSelector((state) => state.loading);
  const [addToStockDialogShow, setAddToStockDialogShow] = useState(false);
  // Add to Stock parameters
  const [packages, setPackages] = useState(0);
  const [units, setUnits] = useState(0);
  const [bags, setBags] = useState(0);
  const [batchNumber, setBatchNumber] = useState(0);
  // Add to Stock parameters
  const toast = useRef(null);

  const [changePage, setchangePage] = useState(0);

  const archiveDateChangeHandler = (newValue) => {
    setArchivedDate(newValue);
  };

  const expiryDateChangeHandler = (newValue) => {
    setExpiryDate(newValue);
  };

  const onGlobalFilterChange = (e) => {
    
    setFirst(1);
    setPage(1);
    setchangePage(1);
    const searchKeyword = e.target.value;
    
    setGlobalFilterValue(searchKeyword);
    
    if (searchKeyword && searchKeyword != "") {
      dispatch(searchItems(1, pageSize, ordering, includeArchive, searchKeyword, selectValue));

    } else {
      dispatch(
        fetchItems(
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
    setFirst(1);
    setPage(1);
    setSelectValue(event.target.value);
    dispatch(searchItems(1, pageSize, ordering, includeArchive, globalFilterValue, event.target.value));
  };

  useEffect(() => {
    dispatch(fetchItems(page, pageSize, ordering, includeArchive, selectValue));
    dispatch(fetchVatGroups());
    dispatch(fetchInvoiceGroups());
    dispatch(fetchItemLists());
    dispatch(setLoader(false));
  }, []);

  const onConfirmClickHandler = () => {
    const entity = {
      id: itemId,
      code: code,
      barcode: barcode,
      account_number: accountNumber,
      name: name,
      print_name: printName,
      hide_on_consultation: hideOnConsultation,
      price: price,
      price_with_vat: priceWithVat,
      minimum_price: minimumPrice,
      minimum_price_with_vat: minimumPriceWithVat,
      wholesale_price: wholeSalePrice,
      wholesaler_discount: wholesaleDiscount,
      producer_discount: producerDiscount,
      special_discount: specialDiscount,
      margin_percent: marginPercent,
      vat_group: vatGroup,
      invoice_group: invoiceGroup,
      item_list: itemList,
      type_code: type,
      parent_amount: parentAmount,
      instructions: instructions,
      archived: archived,
      archived_datetime: archivedDate,
      exclude_discount: excludeDiscount,
      hide_zero_print: hideZeroPrint,
      hide_on_countersale_search: hideOnCountersaleSearch,
      performed_by_rule: performedByRule,
      royalty_fee: royaltyFee,
      external_reporting_code: externalReportingCode,
      external_reporting_code_2: externalReportingCode2,
      external_reporting_code_3: externalReportingCode3,
      hide_on_consultation_search: hideOnConsulationSearch,
      disable_price_calculation: disableAutomaticSellingPriceCalculation,
    };

    dispatch(saveItem(entity, showToast));
    if(globalFilterValue && globalFilterValue !== '')
      dispatch(searchItems(page, pageSize, ordering, includeArchive, globalFilterValue, selectValue));
    else
      dispatch(fetchItems(page, pageSize, ordering, includeArchive, selectValue));
    setAddItemDialogOpen(false);
  };

  const resetAddToStockControls = () => {
    setItemId(0);
    setName('');
    setPackages(0);
    setUnits(0);
    setBatchNumber(0);
    setExpiryDate(dayjs());
  }

  const resetControls = () => {
    setItemId(0);
    setCode("");
    setBarcode("");
    setAccountNumber("");
    setName("");
    setPrintName("");
    setHideOnConsultation(false);
    setPrice(0);
    setPriceWithVat(0);
    setMinimumPrice(0);
    setMinimumPriceWithVat(0);
    setWholeSalePrice(0);
    setWholesaleDiscount(0);
    setProducerDiscount(0);
    setSpecialDiscount(0);
    setMarginPercent(0);
    setVatGroup("");
    setInvoiceGroup(0);
    setItemList(0);
    setType(0);
    setParentAmount(0);
    setInstructions("");
    setArchived(false);
    setArchivedDate(dayjs());
    setExcludeDiscount(false);
    setHideZeroPrint(false);
    setPerformedByRule(0);
    setHideOnCountersaleSearch(false);
    setRoyaltyFee(0);
    setExternalReportingCode(0);
    setExternalReportingCode2(0);
    setExternalReportingCode3(0);
    setHideOnConsulationSearch(false);
    setDisableAutomaticSellingPriceCalculation(false);
  };

  const totalRecords = items?.count;

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
      dispatch(
        searchItems(1, evt.rows, ordering, includeArchive, globalFilterValue, selectValue)
      );
    } 
    else if (useFetch) {
      setFirst(evt.first);
      setPage(page1);
      setPageSize(evt.rows);
      setOrdering(evt.sortField);
      setIncludeArchive(false);
      dispatch(fetchItems(page1, evt.rows, ordering, includeArchive, selectValue));
    } 
    if(globalFilterValue && globalFilterValue != '') {
      dispatch(
        searchItems(page1, evt.rows, ordering, includeArchive, globalFilterValue, selectValue)
      );
    } 
    else if (globalFilterValue !== "") {
      setFirst(evt.first);
      setPage(page1);
      setPageSize(evt.rows);
      setOrdering(evt.sortField);
      setIncludeArchive(false);
      dispatch(searchItems(page1, evt.rows, ordering, includeArchive, globalFilterValue, selectValue));
    }
  };

  const handleCloseItemDialog = () => {
    setAddItemDialogOpen(false);
    resetControls();
  };

  const showToast = (severity, summary, detail) => {
    toast.current.show({severity, summary, detail, life: 3000});
  }

  const modifyItemDialog = () => {
    return (
      <Dialog open={addItemDialogOpen} fullWidth={true} maxWidth={"xl"}>
        <DialogTitle>{"Muokkaa tuotetta"}</DialogTitle>
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
                display: "none",
                backgroundColor: "white",
                borderRadius: 1,
                marginY: 2,
              }}
              label="ID"
              variant="filled"
              value={itemId}
              onChange={(e) => {
                setItemId(e.target.value);
              }}
            />

            <TextField
              fullWidth
              sx={{
                backgroundColor: "white",
                borderRadius: 1,
                marginY: 2,
              }}
              label="Koodi"
              variant="filled"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
              }}
            />

            <TextField
              fullWidth
              sx={{
                backgroundColor: "white",
                borderRadius: 1,
                marginY: 2,
              }}
              label="Viivakoodi"
              variant="filled"
              value={barcode}
              onChange={(e) => {
                setBarcode(e.target.value);
              }}
            />

            <TextField
              fullWidth
              sx={{
                backgroundColor: "white",
                borderRadius: 1,
                marginY: 2,
              }}
              label="Tilin numero *"
              variant="filled"
              value={accountNumber}
              onChange={(e) => {
                setAccountNumber(e.target.value);
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
                marginY: 2,
              }}
              label="Nimi"
              variant="filled"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />

            <TextField
              fullWidth
              sx={{
                backgroundColor: "white",
                borderRadius: 1,
                marginY: 2,
              }}
              label="Tulostenimi"
              variant="filled"
              value={printName}
              onChange={(e) => {
                setPrintName(e.target.value);
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
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={hideOnConsultation}
                    onChange={(e) => setHideOnConsultation(!hideOnConsultation)}
                    size="large"
                    color="default"
                  />
                }
                label="Piilota konsultaatiossa"
              />
            </FormGroup>
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
                marginY: 2,
              }}
              label="Hinta"
              type="number"
              InputProps={{ 
                inputProps: { 
                  min: 0 
                } 
              }}
              variant="filled"
              value={price}
              onChange={(e) => {
                setPrice(e.target.value);
              }}
            />

            <TextField
              fullWidth
              sx={{
                backgroundColor: "white",
                borderRadius: 1,
                marginY: 2,
              }}
              label="Hinta ALV:lla"
              type="number"
              InputProps={{ 
                inputProps: { 
                  min: 0 
                } 
              }}
              variant="filled"
              value={priceWithVat}
              onChange={(e) => {
                setPriceWithVat(e.target.value);
              }}
            />

            <TextField
              fullWidth
              sx={{
                backgroundColor: "white",
                borderRadius: 1,
                marginY: 2,
              }}
              label="Minimihinta"
              type="number"
              InputProps={{ 
                inputProps: { 
                  min: 0 
                } 
              }}
              variant="filled"
              value={minimumPrice}
              onChange={(e) => {
                setMinimumPrice(e.target.value);
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
                marginY: 2,
              }}
              label="Minimihinta ALV:lla"
              type="number"
              InputProps={{ 
                inputProps: { 
                  min: 0 
                } 
              }}
              variant="filled"
              value={minimumPriceWithVat}
              onChange={(e) => {
                setMinimumPriceWithVat(e.target.value);
              }}
            />

            <TextField
              fullWidth
              sx={{
                backgroundColor: "white",
                borderRadius: 1,
                marginY: 2,
              }}
              label="Tukkuhinta"
              type="number"
              InputProps={{ 
                inputProps: { 
                  min: 0 
                } 
              }}
              variant="filled"
              value={wholeSalePrice}
              onChange={(e) => {
                setWholeSalePrice(e.target.value);
              }}
            />

            <TextField
              fullWidth
              sx={{
                backgroundColor: "white",
                borderRadius: 1,
                marginY: 2,
              }}
              label="Tukkualennus"
              type="number"
              InputProps={{ 
                inputProps: { 
                  min: 0 
                } 
              }}
              variant="filled"
              value={wholesaleDiscount}
              onChange={(e) => {
                setWholesaleDiscount(e.target.value);
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
                marginY: 2,
              }}
              label="Tuottaja-alennus"
              type="number"
              InputProps={{ 
                inputProps: { 
                  min: 0 
                } 
              }}
              variant="filled"
              value={producerDiscount}
              onChange={(e) => {
                setProducerDiscount(e.target.value);
              }}
            />

            <TextField
              fullWidth
              sx={{
                backgroundColor: "white",
                borderRadius: 1,
                marginY: 2,
              }}
              label="Erikoisalennus"
              type="number"
              InputProps={{ 
                inputProps: { 
                  min: 0 
                } 
              }}
              variant="filled"
              value={specialDiscount}
              onChange={(e) => {
                setSpecialDiscount(e.target.value);
              }}
            />

            <TextField
              fullWidth
              sx={{
                backgroundColor: "white",
                borderRadius: 1,
                marginY: 2,
              }}
              label="Marginaaliprosentti"
              type="number"
              InputProps={{ 
                inputProps: { 
                  min: 0 
                } 
              }}
              variant="filled"
              value={marginPercent}
              onChange={(e) => {
                setMarginPercent(e.target.value);
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
                style={{ backgroundColor: "#f0f0f0" }}
                sx={{
                  background: "white",
                  display: "flex",
                  flexDirection: "row",
                  gap: 2,
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
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

            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                Laskutusryhmä
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                style={{ backgroundColor: "#f0f0f0" }}
                id="demo-simple-select"
                sx={{
                  background: "white",
                  display: "flex",
                  flexDirection: "row",
                  gap: 2,
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      backgroundColor: "#f0f0f0",
                      color: "black",
                    },
                  },
                }}
                value={invoiceGroup}
                label="Laskutusryhmä"
                onChange={(e) => setInvoiceGroup(e.target.value)}
              >
                {invoiceGroups.results.map((iGroup, index) => (
                  <MenuItem value={iGroup.url}>{iGroup.title}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Tuotelista *</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                style={{ backgroundColor: "#f0f0f0" }}
                id="demo-simple-select"
                sx={{
                  background: "white",
                  display: "flex",
                  flexDirection: "row",
                  gap: 2,
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      backgroundColor: "#f0f0f0",
                      color: "black",
                    },
                  },
                }}
                value={itemList}
                label="Tuotelista *"
                onChange={(e) => setItemList(e.target.value)}
              >
                {itemLists.results.map((item, index) => (
                  <MenuItem value={item.url}>{item.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              marginTop: "30px",
              gap: 2,
            }}
          >
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Kategoria *</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                style={{ backgroundColor: "#f0f0f0" }}
                sx={{
                  background: "white",
                  flexDirection: "row",
                  gap: 2,
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      backgroundColor: "#f0f0f0",
                      color: "black",
                    },
                  },
                }}
                value={type}
                label="Kategoria *"
                onChange={(e) => setType(e.target.value)}
              >
                <MenuItem value={1}>Toimenpide</MenuItem>
                <MenuItem value={2}>Lääke</MenuItem>
                <MenuItem value={3}>Tarvike</MenuItem>
                <MenuItem value={4}>Ruoka</MenuItem>
                <MenuItem value={5}>Laboratorioanalyysi</MenuItem>
                <MenuItem value={6}>Laboratorioanalyysipaneeli</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              sx={{
                backgroundColor: "white",
                borderRadius: 1,
              }}
              label="Ylätasojen määrä"
              type="number"
              InputProps={{ 
                inputProps: { 
                  min: 0 
                } 
              }}
              variant="filled"
              value={parentAmount}
              onChange={(e) => {
                setParentAmount(e.target.value);
              }}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              marginTop: "30px",
              gap: 2,
            }}
          >
            <TextField
              fullWidth
              sx={{
                backgroundColor: "white",
                borderRadius: 1,
              }}
              label="Ohjeet"
              multiline
              rows={5}
              variant="filled"
              value={instructions}
              onChange={(e) => {
                setInstructions(e.target.value);
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
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={archived}
                    onChange={(e) => setArchived(!archived)}
                    size="large"
                    color="default"
                  />
                }
                label="Arkistoitu"
              />
            </FormGroup>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              marginTop: "30px",
              gap: 2,
            }}
          >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="Arkistointipäivä"
                value={archivedDate}
                onChange={archiveDateChangeHandler}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 2,
            }}
          >
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={excludeDiscount}
                    onChange={(e) => setExcludeDiscount(!excludeDiscount)}
                    size="large"
                    color="default"
                  />
                }
                label="Poista alennus"
              />
            </FormGroup>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 2,
            }}
          >
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={hideZeroPrint}
                    onChange={(e) => setHideZeroPrint(!hideZeroPrint)}
                    size="large"
                    color="default"
                  />
                }
                label="Piilota nollatulostus"
              />
            </FormGroup>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              marginTop: "30px",
              gap: 2,
            }}
          >

            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                Sääntösuoritustapa
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                style={{ backgroundColor: "#f0f0f0" }}
                id="demo-simple-select"
                sx={{
                  background: "white",
                  display: "flex",
                  flexDirection: "row",
                  gap: 2,
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      backgroundColor: "#f0f0f0",
                      color: "black",
                    },
                  },
                }}
                value={performedByRule}
                label="Sääntösuoritus"
                onChange={(e) => setPerformedByRule(e.target.value)}
              >
                <MenuItem value={0}>Perintä</MenuItem>
                <MenuItem value={1}>Vaadittu</MenuItem>
                <MenuItem value={2}>Ei vaadittu</MenuItem>
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
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={hideOnCountersaleSearch}
                    onChange={(e) =>
                      setHideOnCountersaleSearch(!hideOnCountersaleSearch)
                    }
                    size="large"
                    color="default"
                  />
                }
                label="Piilota vastamyyntihaussa"
              />
            </FormGroup>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              marginTop: "30px",
              gap: 2,
            }}
          >
            <TextField
              fullWidth
              sx={{
                backgroundColor: "white",
                borderRadius: 1,
              }}
              label="Tekijänoikeusmaksu"
              variant="filled"
              value={royaltyFee}
              onChange={(e) => {
                setRoyaltyFee(e.target.value);
              }}
            />

            <TextField
              fullWidth
              sx={{
                backgroundColor: "white",
                borderRadius: 1,
              }}
              label="Ulkoinen raportointikoodi"
              variant="filled"
              value={externalReportingCode}
              onChange={(e) => {
                setExternalReportingCode(e.target.value);
              }}
            />

            <TextField
              fullWidth
              sx={{
                backgroundColor: "white",
                borderRadius: 1,
              }}
              label="Ulkoinen raportointikoodi 2"
              variant="filled"
              value={externalReportingCode2}
              onChange={(e) => {
                setExternalReportingCode2(e.target.value);
              }}
            />

            <TextField
              fullWidth
              sx={{
                backgroundColor: "white",
                borderRadius: 1,
              }}
              label="Ulkoinen raportointikoodi 3"
              variant="filled"
              value={externalReportingCode3}
              onChange={(e) => {
                setExternalReportingCode3(e.target.value);
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
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={hideOnConsulationSearch}
                    onChange={(e) =>
                      setHideOnConsulationSearch(!hideOnConsulationSearch)
                    }
                    size="large"
                    color="default"
                  />
                }
                label="Piilota konsultaatiohaussa"
              />
            </FormGroup>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 2,
            }}
          >
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={disableAutomaticSellingPriceCalculation}
                    onChange={(e) =>
                      setDisableAutomaticSellingPriceCalculation(
                        !disableAutomaticSellingPriceCalculation
                      )
                    }
                    size="large"
                    color="default"
                  />
                }
                label="Poista automaattinen myyntihinnan laskenta käytöstä"
              />
            </FormGroup>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={handleCloseItemDialog}
            color="warning"
          >
            Peruuta
          </Button>
          <Button
            variant="contained"
            onClick={onConfirmClickHandler}
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

  const openAddItemDialogHandler = () => {
    resetControls();
    setAddItemDialogOpen(true);
  };

  const renderHeader = () => {
    return (
      <Grid spacing={2}>
        <Grid item sx={{
           "@media (min-width: 381px)": 
           {
             display: "flex", 
             flexDirection: "row",
             justifyContent:"flex-end"
           },
          "@media (max-width: 450px)": 
          {
            display: "flex", 
            flexDirection: "column",
            alignItems:"right"
          }
          }}>
          <span className="p-input-icon-left" style={{ float: "right" }}>
            <i className="pi pi-search" />
            <InputText
              value={globalFilterValue}
              onChange={onGlobalFilterChange}
              placeholder="Etsi nimellä"
              style={{ width: "100%" }}
            />
          </span>
          <Select
            label="Suodatin"
            size="small"
            value={selectValue}
            onChange={selectValueHandler}
            MenuProps={{
              PaperProps: {
                sx: {
                  backgroundColor: "#f0f0f0",
                  color: "black",
                },
              },
            }}
            style={{ float: "right", height: "3rem", background: "white" }}
          >
            <MenuItem value="2">Lääkkeet</MenuItem>
            <MenuItem value="3">Tarvikkeet</MenuItem>
          </Select>
        </Grid>
      </Grid>
    );
  };

  const fetchItemsById = async (id) => {
    dispatch(setLoader(true));
    let url = `/item/${id}`;
    return await axios
      .get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${process.env.REACT_APP_TOKEN}`,
        },
        withCredentials: false,
      })
      .then((res) => {
        dispatch(setLoader(false));
        return res.data;
      })
      .catch((error) => {
        dispatch(setLoader(false));
        return error;
      });
  };

  const onEditItemHandler = async (row) => {
    let id = row.id;
    let data = await fetchItemsById(id);
    setItemId(id);
    setCode(data.code);
    setBarcode(data.barcode);
    setAccountNumber(data.account_number ?? '');
    setName(data.name);
    setPrintName(data.print_name);
    setHideOnConsultation(data.hide_on_consultation);
    setPrice(data.price);
    setPriceWithVat(data.price_with_vat);
    setMinimumPrice(data.minimum_price);
    setMinimumPriceWithVat(data.minimum_price_with_vat);
    setWholeSalePrice(data.wholesale_price);
    setWholesaleDiscount(data.wholesaler_discount);
    setProducerDiscount(data.producer_discount);
    setSpecialDiscount(data.special_discount);
    setMarginPercent(data.margin_percent);
    setVatGroup(data.vat_group);
    setInvoiceGroup(data.invoice_group);
    setItemList(data.item_list);
    setType(data.type_code);
    setParentAmount(data.parent_amount);
    setInstructions(data.instructions);
    setArchived(data.archived);
    setArchivedDate(data.archived_datetime);
    setExcludeDiscount(data.exclude_discount);
    setHideZeroPrint(data.hide_zero_print);
    setPerformedByRule(data.performed_by_rule);
    setHideOnCountersaleSearch(data.hide_on_countersale_search);
    setRoyaltyFee(data.royalty_fee);
    setExternalReportingCode(data.external_reporting_code);
    setExternalReportingCode2(data.external_reporting_code_2);
    setExternalReportingCode3(data.external_reporting_code_3);
    setHideOnConsulationSearch(data.hide_on_consultation_search);
    setDisableAutomaticSellingPriceCalculation(data.disable_price_calculation);
    setAddItemDialogOpen(true);
  };

  const typeCode = (row) => GetItemTypes(row.type_code);

  const evalVatGroup = (row) => {
    let vat_url = row.vat_group;
    let vat_group = vatGroups.results.find((vat) => vat.url === row.vat_group);
    return vat_group?.title;
  };

  const header = renderHeader();

  const onAddToStockDialogOpen = async row => {
    const item = await fetchItemsById(row.id);
    resetAddToStockControls();
    setItemId(item.id);
    setName(item.name);
    setAddToStockDialogShow(true);
  }

  const onAddToStockDialogClose = () => {
    resetAddToStockControls();
    setAddToStockDialogShow(false);
  }

  const onAddItemToStockHandler = () => {
    const entity = {
      id: itemId,
      packages: packages,
      units : units,
      batch_number : batchNumber,
      expiry_date : expiryDate,
    };

    dispatch(addToStock(entity, showToast));
    setAddToStockDialogShow(false);
  }


  const addToStockDialog = () => {
    return (
        <Dialog open={addToStockDialogShow}>
          <DialogTitle>{"Lisää varastoon"} - {name}</DialogTitle>
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
                    marginY: 2,
                  }}
                  value={packages}
                  label="Pakkausten määrä"
                  onChange={(evt) => setPackages(evt.target.value)}
                  variant="filled"
              />

              <TextField
                  fullWidth
                  sx={{
                    backgroundColor: "white",
                    borderRadius: 1,
                    marginY: 2,
                  }}
                  label="Pakkausyksikkö"
                  value={units}
                  onChange={(evt) => setUnits(evt.target.value)}
                  variant="filled"
              />

              <TextField
                  fullWidth
                  sx={{
                    backgroundColor: "white",
                    borderRadius: 1,
                    marginY: 2,
                    display: "none"
                  }}
                  label="Pussit"
                  value={bags}
                  disabled
                  variant="filled"
              />
            </Box>
            <Box
                sx={{
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
                  label="Eränumero"
                  value={batchNumber}
                  onChange={(evt) => setBatchNumber(evt.target.value)}
                  variant="filled"
              />

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="Viimeinen käyttöpäivä"
                  value={expiryDate}
                  onChange={expiryDateChangeHandler}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>

            </Box>

          </DialogContent>
          <DialogActions>
            <Button
                variant="contained"
                onClick={onAddToStockDialogClose}
                color="warning"
            >
              Peruuta
            </Button>
            <Button
                variant="contained"
                onClick={onAddItemToStockHandler}
                color="success"
            >
              Vahvista
            </Button>
          </DialogActions>
        </Dialog>
    );
  }

  return (
    <Box>
        <Typography variant="h5" color="white" sx={{ marginBottom: 3 }}>
          Tuotteet
        </Typography>

        <Box>
          <DataTable
            value={items.results}
            stripedRows
            paginator
            rows={pageSize}
            rowsPerPageOptions={[5, 10, 25, 50]}
            sortField="name"
            removableSort
            dataKey="id"
            globalFilterFields={["name"]}
            header={header}
            emptyMessage="No item found."
            scrollHeight="400px"
            lazy
            first={first}
            responsiveLayout="scroll"
            totalRecords={totalRecords}
            onPage={onPageEvent}
            loading={loading.loading}
          >
            <Column field="id" header="ID"></Column>
            <Column field="type_code" header="Kategoria" body={typeCode}></Column>
            <Column field="name" header="Nimi"></Column>
            <Column field="vat_group" header="ALV-ryhmä" body={evalVatGroup}></Column>
            <Column field="code" header="Koodi" align={ "center" }></Column>
            <Column field="barcode" header="Viivakoodi" align={ "center" }></Column>
            <Column field="wholesale_price" header="Tukkuhinta ennen ALV:ia" align={ "center" }></Column>
            <Column field="minimum_price" header="Myyntihinta ennen ALV:ia" align={ "center" }></Column>
            <Column
              header="Toiminnot"
              alignHeader={"center"}
              align={"center"}
              key="edit"
              body={(rowData) => (
                <span>

                  <IconButton
                    sx={{
                      color: "grey",
                    }}
                    size="small"
                    onClick={() => onEditItemHandler(rowData)}
                  >
                    <CreateIcon></CreateIcon>
                  </IconButton>

                  <IconButton
                    sx={{
                      color: "grey",
                    }}
                    size="small"
                    onClick={() => onAddToStockDialogOpen(rowData)}
                  >
                    <AddCircleIcon></AddCircleIcon>
                  </IconButton>
                </span>
              )}
            />
          </DataTable>
        </Box>

        {modifyItemDialog()}
        {addToStockDialog()}
        <Toast ref={toast} />
      </Box>
  );
};

export default ManageItems;