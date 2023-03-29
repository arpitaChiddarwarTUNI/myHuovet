import { useEffect, useRef, useState } from "react";
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
import { fetchAllVatGroups } from "../store/features/vatGroupSlice";


const ManageVatGroups = () => {
    // grid properies
    const dispatch = useDispatch();
    const [pageSize, setPageSize] = useState(5);
    const [first, setFirst] = useState(0);
    // grid properies

    const vatGroups = useSelector((state) => state.vatGroups);
    const toast = useRef(null);
    const loading = useSelector((state) => state.loading);

    useEffect(() => {
        dispatch(fetchAllVatGroups());
        dispatch(setLoader(false));
    }, []);

    const totalRecords = vatGroups?.count;

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
                Vat Groups
            </Typography>

            <Box>
                <DataTable
                    value={vatGroups.results}
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
                    <Column field="title" header="Title"></Column>
                    <Column field="percentage" header="Percentage"></Column>
                    <Column field="archived" header="Archived"></Column>
                    <Column field="account_number" header="Account Number"></Column>
                </DataTable>
            </Box>

            <Toast ref={toast} />
        </Box>
    );
};

export default ManageVatGroups;