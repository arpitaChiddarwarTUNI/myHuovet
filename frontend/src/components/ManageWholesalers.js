import { useEffect, useRef, useState } from "react";
import {
  deleteWholesaler,
  fetchWholesalers,
  saveWholesaler,
} from "../store/features/wholesalerSlice";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import AddIcon from "@mui/icons-material/Add";
import { setLoader } from "../store/features/loadingSlice";
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import CreateIcon from "@mui/icons-material/Create";
import { Toast } from "primereact/toast";
import { useDispatch, useSelector } from "react-redux";
import DeleteIcon from "@mui/icons-material/Delete";

const ManageWholesalers = () => {
  // form controls starts
  const [operation, setOperation] = useState("Add new");
  const [id, setId] = useState(0);
  const [name, setName] = useState("");
  const [customerNumber, setCustomerNumber] = useState("");
  const [vatNumber, setVatNumber] = useState("");
  const [registerNumber, setRegisterNumber] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [streetAddress2, setStreetAddress2] = useState(false);
  const [zipCode, setZipCode] = useState(0);
  const [city, setCity] = useState(0);
  const [email, setEmail] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState(0);
  const [notes, setNotes] = useState(0);
  // form controls ends

  // grid properies
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [ordering, setOrdering] = useState("name");
  const [includeArchive, setIncludeArchive] = useState(false);
  const [first, setFirst] = useState(0);
  // grid properies

  const [addWholesalerDialogOpen, setAddWholesalerDialogOpen] = useState(false);

  const wholesalers = useSelector((state) => state.wholesalers);

  const toast = useRef(null);

  const loading = useSelector((state) => state.loading);

  useEffect(() => {
    dispatch(fetchWholesalers(page, pageSize, ordering, includeArchive));
    dispatch(setLoader(false));
  }, []);

  const onConfirmClickHandler = () => {
    const entity = {
      id: id,
      name: name,
      customer_number: customerNumber,
      vat_number: vatNumber,
      register_number: registerNumber,
      street_address: streetAddress,
      street_address_2: streetAddress2,
      zip_code: zipCode,
      city: city,
      email: email,
      phone_number: phoneNumber,
      notes: notes,
    };

    dispatch(saveWholesaler(entity, showToast));
    dispatch(fetchWholesalers(page, pageSize, ordering, includeArchive));
    setAddWholesalerDialogOpen(false);
  };

  const resetControls = () => {
    setId(0);
    setName("");
    setCustomerNumber("");
    setVatNumber("");
    setRegisterNumber("");
    setStreetAddress("");
    setStreetAddress2("");
    setZipCode("");
    setCity("");
    setEmail("");
    setPhoneNumber("");
    setNotes("");
    // setHideOnConsulationSearch(false);
    // setDisableAutomaticSellingPriceCalculation(false);
  };

  const totalRecords = wholesalers?.count;

  const onPageEvent = (evt) => {
    let page1 = evt.page + 1;
    setFirst(evt.first);
    setPage(page1);
    setPageSize(evt.rows);
    setOrdering(evt.sortField);
    setIncludeArchive(false);

    dispatch(fetchWholesalers(page1, evt.rows, ordering, includeArchive));
  };

  const handleCloseWholesalerDialog = () => {
    setAddWholesalerDialogOpen(false);
    resetControls();
  };

  const showToast = (severity, summary, detail) => {
    toast.current.show({ severity, summary, detail, life: 3000 });
  };

  const wholesalerDialog = () => {
    return (
      <Dialog open={addWholesalerDialogOpen} fullWidth={true} maxWidth={"xl"}>
        <DialogTitle>
          {operation}
          {" wholesaler"}
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 2,
              "@media (max-width: 750px)": 
              {
              display: "flex", 
              flexDirection: "column",
              alignItems:"right",
              gap: 0
              }
            }}
          >
            <TextField
              fullWidth
              sx={{
                backgroundColor: "white",
                borderRadius: 1,
                marginY: 2,
                "@media (max-width: 750px)": 
                {
                  marginTop:"0px !important",
                  marginBottom:"0px !important"
                }
              }}
              label="Name *"
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
                "@media (max-width: 750px)": 
                {
                  marginTop:"8px !important",
                  marginBottom:"8px !important"
                }
              }}
              label="Customer Number"
              variant="filled"
              value={customerNumber}
              onChange={(e) => {
                setCustomerNumber(e.target.value);
              }}
            />

            <TextField
              fullWidth
              sx={{
                backgroundColor: "white",
                borderRadius: 1,
                marginY: 2,
                "@media (max-width: 750px)": 
                {
                  marginTop:"1px !important",
                  marginBottom:"8px !important"
                }
              }}
              label="Vat Number"
              type="number"
              InputProps={{ 
                inputProps: { 
                  min: 0 
                } 
              }}
              variant="filled"
              value={vatNumber}
              onChange={(e) => {
                setVatNumber(e.target.value);
              }}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 2,
              "@media (max-width: 750px)": 
              {
              display: "flex", 
              flexDirection: "column",
              alignItems:"right",
              gap: 0
              }
            }}
          >
            <TextField
              fullWidth
              sx={{
                backgroundColor: "white",
                borderRadius: 1,
                marginY: 2,
                "@media (max-width: 750px)": 
                {
                  marginTop:"1px !important",
                  marginBottom:"8px !important"
                }
              }}
              label="Register Number"
              type="number"
              InputProps={{ 
                inputProps: { 
                  min: 0 
                } 
              }}
              variant="filled"
              value={registerNumber}
              onChange={(e) => {
                setRegisterNumber(e.target.value);
              }}
            />

            <TextField
              fullWidth
              sx={{
                backgroundColor: "white",
                borderRadius: 1,
                marginY: 2,
                "@media (max-width: 750px)": 
                {
                  marginTop:"1px !important",
                  marginBottom:"8px !important"
                }
              }}
              label="Street Address"
              variant="filled"
              value={streetAddress}
              onChange={(e) => {
                setStreetAddress(e.target.value);
              }}
            />

            <TextField
              fullWidth
              sx={{
                backgroundColor: "white",
                borderRadius: 1,
                marginY: 2,
                "@media (max-width: 750px)": 
                {
                  marginTop:"1px !important",
                  marginBottom:"8px !important"
                }
              }}
              label="Street Address 2"
              variant="filled"
              value={streetAddress2}
              onChange={(e) => {
                setStreetAddress2(e.target.value);
              }}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 2,
              "@media (max-width: 750px)": 
              {
              display: "flex", 
              flexDirection: "column",
              alignItems:"right",
              gap: 0
              }
            }}
          >
            <TextField
              fullWidth
              sx={{
                backgroundColor: "white",
                borderRadius: 1,
                marginY: 2,
                "@media (max-width: 750px)": 
                {
                  marginTop:"1px !important",
                  marginBottom:"8px !important"
                }
              }}
              label="Zip code"
              variant="filled"
              value={zipCode}
              onChange={(e) => {
                setZipCode(e.target.value);
              }}
            />

            <TextField
              fullWidth
              sx={{
                backgroundColor: "white",
                borderRadius: 1,
                marginY: 2,
                "@media (max-width: 750px)": 
                {
                  marginTop:"1px !important",
                  marginBottom:"8px !important"
                }
              }}
              label="City"
              variant="filled"
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
              }}
            />

            <TextField
              fullWidth
              sx={{
                backgroundColor: "white",
                borderRadius: 1,
                marginY: 2,
                "@media (max-width: 750px)": 
                {
                  marginTop:"1px !important",
                  marginBottom:"8px !important"
                }
              }}
              label="Email"
              variant="filled"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 2,
              "@media (max-width: 750px)": 
              {
              display: "flex", 
              flexDirection: "column",
              alignItems:"right"
              }
            }}
          >
            <TextField
              fullWidth
              sx={{
                backgroundColor: "white",
                borderRadius: 1,
                marginY: 2,
                "@media (max-width: 750px)": 
                {
                  marginTop:"1px !important",
                  marginBottom:"-8px !important"
                }
              }}
              label="Phone number"
              type="number"
              InputProps={{ 
                inputProps: { 
                  min: 0 
                } 
              }}
              variant="filled"
              value={phoneNumber}
              onChange={(e) => {
                setPhoneNumber(e.target.value);
              }}
            />

            <TextField
              fullWidth
              sx={{
                backgroundColor: "white",
                borderRadius: 1,
                marginY: 2,
                "@media (max-width: 750px)": 
                {
                  marginTop:"0px !important"
                }
              }}
              label="Notes"
              variant="filled"
              value={notes}
              onChange={(e) => {
                setNotes(e.target.value);
              }}
            />

          </Box>

        </DialogContent>
        <DialogActions styles={{
          display:"flex",
          flexDirection:"row",
          justifyContent:"flexStart"
        }}>
          <Button
            variant="contained"
            onClick={handleCloseWholesalerDialog}
            color="warning"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={onConfirmClickHandler}
            color="success"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const openAddWholesalerDialogHandler = () => {
    resetControls();
    setAddWholesalerDialogOpen(true);
  };

  const renderHeader = () => {
    return (
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Button
            type="button"
            variant="contained"
            size="large"
            color="primary"
            style={{}}
            margin="normal"
            startIcon={<AddIcon />}
            onClick={() => openAddWholesalerDialogHandler()}
          >
            Add New Wholesaler
          </Button>
        </Grid>

        <Grid item xs={6}></Grid>
      </Grid>
    );
  };

  const fetchWholesalersById = async (id) => {
    dispatch(setLoader(true));
    let url = `/wholesaler/${id}`;
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

  const onEditWholesalerHandler = async (row) => {
    setOperation("Edit");
    let id = row.id;
    let data = await fetchWholesalersById(id);
    setId(id);
    setName(data.name);
    setCustomerNumber(data.customer_number);
    setVatNumber(data.vat_number);
    setRegisterNumber(data.register_number);
    setStreetAddress(data.street_address);
    setStreetAddress2(data.street_address_2);
    setZipCode(data.zip_code);
    setCity(data.city);
    setEmail(data.email);
    setPhoneNumber(data.phone_number);
    setNotes(data.notes);
    setAddWholesalerDialogOpen(true);
  };

  const onDeleteWholesalerHandler = (data) => {
    var choice = window.confirm(`Are you sure you want to delete this wholesaler "${data.name}"?`);
    if (!choice) return;

    dispatch(deleteWholesaler(data.id, showToast));
    dispatch(fetchWholesalers(page, pageSize, "name", false));
  };

  const header = renderHeader();

  return (
    <Box>
      <Typography variant="h5" color="white" sx={{ marginBottom: 3 }}>
        Wholesalers
      </Typography>

      <Box>
        <DataTable
          value={wholesalers.results}
          stripedRows
          paginator
          rows={pageSize}
          rowsPerPageOptions={[5, 10, 25, 50]}
          sortField="name"
          removableSort
          dataKey="id"
          globalFilterFields={["name"]}
          header={header}
          emptyMessage="No wholesaler found."
          scrollHeight="400px"
          lazy
          first={first}
          responsiveLayout="scroll"
          totalRecords={totalRecords}
          onPage={onPageEvent}
          loading={loading.loading}
        >
          <Column field="id" header="Id"></Column>
          <Column field="name" header="Name"></Column>
          <Column field="customer_number" header="Customer Number"></Column>
          <Column field="vat_number" header="VAT Number"></Column>
          <Column
            field="register_number"
            header="Register Number"
            align={"center"}
          ></Column>
          <Column field="email" header="Email"></Column>
          <Column field="phone_number" header="Phone Number"></Column>
          <Column field="notes" header="Notes"></Column>
          <Column
            header="Actions"
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
                  onClick={() => onEditWholesalerHandler(rowData)}
                >
                  <CreateIcon></CreateIcon>
                </IconButton>

                <IconButton
                  sx={{
                    color: "grey",
                  }}
                  size="small"
                  onClick={() => onDeleteWholesalerHandler(rowData)}
                >
                  <DeleteIcon></DeleteIcon>
                </IconButton>
              </span>
            )}
          />
        </DataTable>
      </Box>

      {wholesalerDialog()}
      <Toast ref={toast} />
    </Box>
  );
};

export default ManageWholesalers;
