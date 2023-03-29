import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./features/authSlice";
import customerSlice from "./features/customerSlice";
import patientsSlice from "./features/patientsSlice";
import appointmentsSlice from "./features/appointmentsSlice";
import appointmenttypesSlice from "./features/appointmenttypesSlice";
import examinationtypesSlice from "./features/examinationtypesSlice";
import diagnosetypesSlice from "./features/diagnosetypesSlice";
import speciesSlice from "./features/speciesSlice";
import staffSlice from "./features/staffSlice";
import supplySlice from "./features/supplySlice";
import medicineSlice from "./features/medicineSlice";
import billSlice from "./features/billSlice";
import itemSlice from "./features/itemSlice";
import stockSlice from "./features/stockSlice";
import vatGroupSlice from "./features/vatGroupSlice";
import invoiceGroupSlice from "./features/invoiceGroupSlice";
import itemListSlice from "./features/itemListSlice";
import loadingSlice from "./features/loadingSlice";
import stockBatchSlice from "./features/stockBatchSlice";
import stockLevelSlice from "./features/stockLevelSlice";
import departmentSlice from "./features/departmentSlice";
import stockEntriesSlice from "./features/stockEntriesSlice";
import wholesalerSlice from "./features/wholesalerSlice";


const store = configureStore({
    reducer: {
        auth: authSlice,
        customer: customerSlice,
        patients: patientsSlice,
        appointments: appointmentsSlice,
        appointmenttypes: appointmenttypesSlice,
        examinationtypes: examinationtypesSlice,
        diagnosetypes: diagnosetypesSlice,
        species: speciesSlice,
        staff: staffSlice,
        supplies: supplySlice,
        medicines: medicineSlice,
        bill: billSlice,
        items: itemSlice,
        stocks: stockSlice,
        vatGroups: vatGroupSlice,
        invoiceGroups: invoiceGroupSlice,
        itemLists: itemListSlice,
        loading: loadingSlice,
        stockBatches: stockBatchSlice,
        stockLevels: stockLevelSlice,
        departments: departmentSlice,
        stockEntries: stockEntriesSlice,
        wholesalers: wholesalerSlice,
    },
});

export default store;
