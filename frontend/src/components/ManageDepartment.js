import { useEffect, useRef, useState } from "react";
import {
    fetchDepartments
} from "../store/features/departmentSlice";
import {
  Grid,
  Typography
} from "@mui/material";
import { Box } from "@mui/system";
import { setLoader } from "../store/features/loadingSlice";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { useDispatch, useSelector } from "react-redux";


const ManageDepartment = () => {
    // form controls starts
    const [id, setId] = useState(0);
    const [name, setName] = useState("");
    const [activeItemList, setActiveItemList] = useState(""); // url
    const [email, setEmail] = useState("");
    const [website, setWebsite] = useState("");
    const [logo, setLogo] = useState("");
    // form controls ends

    // address controls
    const [phone, setPhone] = useState("");
    const [streetAddress1, setStreetAddress1] = useState('');
    const [streetAddress2, setStreetAddress2] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    // address controls
  
    // grid properies
    const dispatch = useDispatch();
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [ordering, setOrdering] = useState("name");
    const [includeArchive, setIncludeArchive] = useState(false);
    const [first, setFirst] = useState(0);
    // grid properies
  
    const [viewDepartmentDialogOpen, setViewDepartmentDialogOpen] = useState(false);
  
    const departments = useSelector((state) => state.departments);
  
    const toast = useRef(null);
  
    const loading = useSelector((state) => state.loading);
  
    useEffect(() => {
      dispatch(fetchDepartments());
      dispatch(setLoader(false));
    }, []);
  
    const resetControls = () => {
      setId(0);
      setName("");
      setActiveItemList("");
      setEmail("");
      setWebsite("");
      setLogo("");
      setPhone("");
      setStreetAddress1("");
      setStreetAddress2("");
      setZipCode("");
      setCity("");
      setState("");
    };
  
    const totalRecords = departments?.count;
  
    const renderHeader = () => {
      return (
        <Grid container spacing={2}>
          <Grid item xs={6}>

          </Grid>
  
          <Grid item xs={6}></Grid>
        </Grid>
      );
    };
  
    const header = renderHeader();
  
    return (
      <Box>
        <Typography variant="h5" color="white" sx={{ marginBottom: 3 }}>
          Departments
        </Typography>
  
        <Box>
          <DataTable
            value={departments.results}
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
            loading={loading.loading}
          >
            <Column field="id" header="Id"></Column>
            <Column field="name" header="Name"></Column>
            <Column field="email" header="Email"></Column>
            <Column field="website" header="Website"></Column>
            <Column field="phone" header="Phone"></Column>
            <Column field="city" header="City"></Column>
            <Column field="state" header="State"></Column>
          </DataTable>
        </Box>
  
        <Toast ref={toast} />
      </Box>
    );
  };

export default ManageDepartment;