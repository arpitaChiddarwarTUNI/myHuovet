import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setLoader } from "./loadingSlice";
import moment from "moment";

const initialState = {
    count: 0,
    num_pages: 0,
    next: null,
    previous: null,
    results: [],
};

const stockEntriesSlice = createSlice({
    name: "stockEntries",
    initialState: initialState,
    reducers: {
        getStockEntries(state, action) {
            return action.payload;
        }
    },
});

export const {
    getStockEntries: getStockEntries
} = stockEntriesSlice.actions;

export const stockEntriesSelector = (state) => state.stockEntries;

export default stockEntriesSlice.reducer;

export const fetchStockEnteries = () => async (dispatch) => {
    dispatch(setLoader(true));

    let url = `/stock/entry?&page_size=1000`;

    await axios
        .get(url, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${process.env.REACT_APP_TOKEN}`
            },
            withCredentials: false,
        })
        .then((res) => {
            dispatch(setLoader(false));
            dispatch(getStockEntries({
                count: res.data.count,
                num_pages: res.data.num_pages,
                next: res.data.next,
                previous: res.data.previous,
                results: res.data.results
            }));
        })
        .catch((error) => {
            dispatch(setLoader(false));
        });
};
