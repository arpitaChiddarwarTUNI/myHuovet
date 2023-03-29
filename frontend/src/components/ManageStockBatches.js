import { Box } from "@mui/system";
import {
    TextField,
    Typography,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    Grid, IconButton, 
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useRef, useState, useEffect } from "react";
import {useDispatch, useSelector} from "react-redux";
import moment from "moment";
import { InputText } from "primereact/inputtext";
import {
    deleteStockBatch,
    fetchStockBatches, saveStockBatch,
    searchStockBatches
} from "../store/features/stockBatchSlice";
import dayjs from "dayjs";
import { setLoader } from "../store/features/loadingSlice";
import axios from "axios";
import { extractIdFromUrl, getByUrl } from "../constants/HelperFunctions";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DateTimePicker} from "@mui/x-date-pickers";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {Toast} from "primereact/toast";
import {Column} from "primereact/column";
import CreateIcon from "@mui/icons-material/Create";
import {DataTable} from "primereact/datatable";

const ManageStockBatches = (props) => {
    const [globalFilterValue, setGlobalFilterValue] = useState("");
    const [pageSize, setPageSize] = useState(5);
    const [first, setFirst] = useState(0);
    const [stockDialogOpen, setStockDialogOpen] = useState(false);
    const [pageNumber, setPageNumber] = useState(0);
    const toast = useRef(null);
    const dispatch = useDispatch();
    const stockBatches = useSelector((state) => state.stockBatches);
    const loading = useSelector((state) => state.loading);
    const vatGroups = useSelector((state) => state.vatGroups);

    // Stock batch parameters
    const [id, setId] = useState(0);
    const [batchNumber, setBatchNumber] = useState("");
    const [expiryDate, setExpiryDate] = useState(dayjs());
    const [stockItem, setStockItem] = useState('');
    // Stock batch parameters

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        dispatch(searchStockBatches(pageSize, "name", false, value));
        setGlobalFilterValue(value);
    };

    useEffect(() => {
        dispatch(fetchStockBatches(pageNumber, pageSize, "name", false));
    }, []);

    const totalRecords = stockBatches?.count;
    const onPageEvent = (evt) => {
        let page1 = evt.page + 1;
        setFirst(evt.first);
        setPageSize(evt.rows);
        setPageNumber(page1);
        dispatch(fetchStockBatches(evt.page + 1, evt.rows, evt.sortField, false));
    };

    const resetBatchControls = () => {
        setId(0);
        setBatchNumber("");
        setExpiryDate(dayjs());
        setStockItem("");
    };

    const closeStockDialogHandler = () => {
        setStockDialogOpen(false);
        resetBatchControls();
    };

    const fetchBatchesById = async (id) => {
        dispatch(setLoader(true));
        let url = `/stock/batch/${id}`;
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

    const onStockDialogOpenHandler = async (rowData) => {
        if (!rowData) {
            resetBatchControls();
            setStockDialogOpen(true);
            return;
        }

        var id = extractIdFromUrl(rowData.url);
        setId(id);

        let batch = await getByUrl('/stock/batch/' + id);
        setBatchNumber(batch.batch_number);
        setExpiryDate(batch.expiry_date);
        setStockItem(batch.stock_item);
        setStockDialogOpen(true);
    };

    const expiryDateChangeHandler = (newValue) => {
        setExpiryDate(newValue);
    };

    const onSaveBatchHandler = () => {
        var entity = {
            id: id,
            batch_number: batchNumber,
            expiry_date: expiryDate
        };

        dispatch(saveStockBatch(entity, showToast));
        setStockDialogOpen(false);
    }

    const stockBatchDialog = () => {
        return (
            <Dialog open={stockDialogOpen}>
                <DialogContent>
                    <Box>
                        <Typography variant={"h6"} color={"white"} sx={{ marginBottom: 3 }}>
                            Batch: <br />
                        </Typography>
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
                            label="Batch Number"
                            variant="filled"
                            value={batchNumber}
                            onChange={(e) => {
                                setBatchNumber(e.target.value);
                            }}
                        />

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateTimePicker
                                label="Expiry Date"
                                value={expiryDate}
                                onChange={expiryDateChangeHandler}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </LocalizationProvider>

                    </Box>

                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            gap: 2,
                            marginTop: '2rem'
                        }}
                    >

                    </Box>

                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        onClick={closeStockDialogHandler}
                        color="warning"
                    >
                        Close
                    </Button>

                    <Button variant="contained"
                            color="success"
                            onClick={() => onSaveBatchHandler()}
                    >
                        Save
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
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <Button
                        type="button"
                        variant="contained"
                        size="large"
                        style={{ display: "none"}}
                        color="primary"
                        margin="normal"
                        startIcon={<AddIcon />}
                        onClick={() => onStockDialogOpenHandler()}
                    >
                        Add New Stock Batch
                    </Button>
                </Grid>
                <Grid item xs={6}>
          <span className="p-input-icon-left" style={{ float: "right" }}>
            <i className="pi pi-search" />
            <InputText
                value={globalFilterValue}
                onChange={onGlobalFilterChange}
                placeholder="Search by Batch Number"
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

    const onDeleteStockBatchHandler = (url) => {
        var choice = window.confirm("Are you sure you want to delete this batch?");
        if (!choice) return;

        var urlArray = [];

        if (url && url.length > 0) urlArray = url.split("/");

        var id = 0;

        id =
            urlArray[urlArray.length - 1] != ""
                ? urlArray[urlArray.length - 1]
                : urlArray[urlArray.length - 2];

        dispatch(deleteStockBatch(id, showToast));

        if (globalFilterValue && globalFilterValue !== "")
            dispatch(searchStockBatches(pageSize, "name", false, globalFilterValue));
        else dispatch(fetchStockBatches(pageNumber, pageSize, "name", false));
    };

    const header = renderHeader();

    const renderItemName = (rowData) => {
        //=> TODO - Set items names in the grid
        //=> TODO - Fix following logic
        let itemUrl = rowData?.stock_item.item;
        let item = props.items.results.find(x => x.url == itemUrl);
        return item ? item.name : '';
    }

    return (<>
        <Box>
            <DataTable
                value={stockBatches.results}
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
                <Column field="" header="Item" body={renderItemName}></Column>
                <Column field="batch_number" header="Batch Number"></Column>
                <Column field="expiry_date" header="Expiry Date"></Column>
                {/*<Column field="stock_item" header="Stock Item" align={ "center" }></Column>*/}
                <Column field="quantity" header="Quantity" align={"center"}></Column>
                <Column field="units" header="Units" align={"center"}></Column>
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
                                onClick={() => onStockDialogOpenHandler(rowData)}
                            >
                                <CreateIcon></CreateIcon>
                            </IconButton>
                            <IconButton
                                sx={{
                                    color: "grey",
                                }}
                                size="small"
                                onClick={() => onDeleteStockBatchHandler(rowData.url)}
                            >
                                <DeleteIcon></DeleteIcon>
                            </IconButton>
                        </>
                    )}
                />
            </DataTable>
        </Box>

        {stockBatchDialog()}

        <Toast ref={toast} />
    </>);

}

export default ManageStockBatches;