import { Box } from "@mui/system";
import {
    Typography,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    Grid, IconButton
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import BarChartIcon from '@mui/icons-material/BarChart';
import { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDepartments } from '../store/features/departmentSlice';
import moment from "moment";
import { InputText } from "primereact/inputtext";
import { setLoader } from "../store/features/loadingSlice";
import axios from "axios";
import { extractIdFromUrl} from "../constants/HelperFunctions";
import {
    fetchStockLevelsWithParams,
    searchStockLevels
} from "../store/features/stockLevelSlice";
import { Toast } from "primereact/toast";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { fetchStockEnteries} from "../store/features/stockEntriesSlice";
import { GetStockEntryTypes } from '../constants/StockEntryTypes';

const ManageStockLevels = (props) => {
    const [globalFilterValue, setGlobalFilterValue] = useState("");
    const [pageSize, setPageSize] = useState(5);
    const [first, setFirst] = useState(0);
    const [stockDialogOpen, setStockDialogOpen] = useState(false);
    const [pageNumber, setPageNumber] = useState(0);
    const toast = useRef(null);
    const dispatch = useDispatch();
    const stockLevels = useSelector((state) => state.stockLevels);
    const loading = useSelector((state) => state.loading);
    const [openEntriesDialog, setOpenEntriesDialog] = useState(false);
    const [stockLevelUrl, setStockLevelUrl] = useState('');
    const departments = useSelector((state) => state.departments);
    const stockEntries = useSelector((state) => state.stockEntries);

    // Stock level parameters
    const [id, setId] = useState(0);
    const [stockItem, setStockItem] = useState("");
    const [stockDepartment, setStockDepartment] = useState("");

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        dispatch(searchStockLevels(pageSize, "name", false, value));
        setGlobalFilterValue(value);
    };

    useEffect(() => {
        dispatch(fetchStockLevelsWithParams(pageNumber, pageSize, "name", false));
        dispatch(fetchDepartments());
        dispatch(fetchStockEnteries());
    }, []);

    const totalRecords = stockLevels?.count;

    const onPageEvent = (evt) => {
        let page1 = evt.page + 1;
        setFirst(evt.first);
        setPageSize(evt.rows);
        setPageNumber(page1);
        dispatch(fetchStockLevelsWithParams(evt.page + 1, evt.rows, evt.sortField, false));
    };

    const resetBatchControls = () => {
        setId(0);
        setStockItem("");
        setStockDepartment("");
    };

    const closeStockLevelDialogHandler = () => {
        setStockDialogOpen(false);
        resetBatchControls();
    };

    const fetchStockLevelsById = async (id) => {
        dispatch(setLoader(true));
        let url = `/stocklevel/${id}`;
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

    const renderHeader = () => {
        return (
            <Grid container spacing={2}>
                <Grid item xs={6}>

                </Grid>
                <Grid item xs={6}>
                    <span className="p-input-icon-left" style={{ float: "right" }}>
                        <i className="pi pi-search" />
                        <InputText
                            value={globalFilterValue}
                            onChange={onGlobalFilterChange}
                            placeholder="Search by Item"
                            style={{ width: "100%" }}
                        />
                    </span>
                </Grid>
            </Grid>
        );
    };

    const showToast = (severity, summary, detail) => {
        toast.current.show({ severity, summary, detail, life: 3000 });
    };

    const onStockEntriesDialogOpen = async (rowData) => {
        setStockLevelUrl(rowData.url);
        setOpenEntriesDialog(true);
    }

    const onStockEntriesDialogClose = () => {
        setOpenEntriesDialog(false);
    }

    const header = renderHeader();

    const renderItemName = (data) => {
        let id = extractIdFromUrl(data.item);
        let result = props.items.results.find(x => x.id == id);
        return result ? result.name : '';
    }

    const renderDepartmentName = (data) => {
        let id = extractIdFromUrl(data.department);
        let result = departments.results.find(x => x.id == id);
        return result ? result.name : '';
    }

    const renderHeaderStockEntries = () => {
        return (
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <Button
                        type="button"
                        variant="contained"
                        size="large"
                        style={{ display: "none" }}
                        color="primary"
                        margin="normal"
                        startIcon={<AddIcon />}
                    // onClick={() => onStockDialogOpenHandler()}
                    >
                        Add New Stock Batch
                    </Button>
                </Grid>
                <Grid item xs={6}>
                    <span className="p-input-icon-left" style={{ float: "right" }}>
                    </span>
                </Grid>
            </Grid>
        );
    };

    const headerStockEntries = renderHeaderStockEntries();

    const renderType = (rowData) => {
        return GetStockEntryTypes(rowData.type);
    }

    const dateFormat = (dt) => {
        return new moment(dt).format("DD.MM.YYYY");
    };

    return (<>
        <Box>
            <DataTable
                value={stockLevels.results}
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
                <Column field="item" header="Item" body={renderItemName}></Column>
                <Column field="department" header="Department" body={renderDepartmentName}></Column>
                <Column field="stock_level" header="Stock level" align={"center"}></Column>
                <Column
                    style={{ width: "15rem" }}
                    header="Actions"
                    alignHeader={"center"}
                    align={"center"}
                    key="edit"
                    body={(rowData) => (
                        <>
                            <IconButton
                                sx={{
                                    color: "grey",
                                }}
                                size="small"
                                onClick={() => onStockEntriesDialogOpen(rowData) }
                            >
                                <BarChartIcon></BarChartIcon>
                            </IconButton>
                        </>
                    )}
                />
            </DataTable>
        </Box>

        <Toast ref={toast} />

        <Dialog open={openEntriesDialog} fullWidth={true} maxWidth={"xl"}>
            <DialogContent>
                <Box>
                    <Typography variant={"h6"} color={"white"} sx={{ marginBottom: 3 }}>
                        Stock Enteries: <br />
                    </Typography>
                </Box>

                <Box>
                    <DataTable
                        value={stockEntries.results.filter(x => x.stock_item == stockLevelUrl)}
                        stripedRows
                        paginator
                        rows={pageSize}
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        sortField="name"
                        removableSort
                        dataKey="id"
                        globalFilterFields={["name"]}
                        header={headerStockEntries}
                        emptyMessage="No item found."
                        scrollHeight="400px"
                        lazy
                        responsiveLayout="scroll"
                        totalRecords={stockEntries.results.filter(x => x.stock_item == stockLevelUrl).length}
                        loading={loading.loading}
                    >
                        <Column field="type" header="Type" body={renderType}></Column>
                        <Column field="date_of_entry" header="Date of Entry" body={ dateFormat }></Column>
                        <Column field="descirption" header="Description" align={"center"}></Column>
                        <Column field="inventory_level_packages" header="Inventory Level Packages" align={"center"}></Column>
                        <Column field="inventory_level_units" header="Inventory Level Units" align={"center"}></Column>
                        <Column field="quantity" header="Quantity" align={"center"}></Column>
                        <Column field="units" header="Units" align={"center"}></Column>
                        <Column field="usage_size" header="Usage" align={"center"}></Column>
                        <Column field="wholesale_price" header="Wholesale Price" align={"center"}></Column>
                        <Column field="wholesale_value" header="Wholesale Value" align={"center"}></Column>
                    </DataTable>
                </Box>

            </DialogContent>
            <DialogActions>
                <Button
                    variant="contained"
                    onClick={() => onStockEntriesDialogClose()}
                    color="warning"
                >
                    Close
                </Button>
            </DialogActions>
        </Dialog>

    </>);
}

export default ManageStockLevels;