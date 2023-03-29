import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setLoader } from "./loadingSlice";
import { extractIdFromUrl, getByUrl } from "../../constants/HelperFunctions";

const initialState = {
    count: 0,
    num_pages: 0,
    next: null,
    previous: null,
    results: [],
};

const stockLevelSlice = createSlice({
    name: "stockLevels",
    initialState: initialState,
    reducers: {
        getStockLevels(state, action) {
            return action.payload;
        }
    },
});

export const {
    getStockLevels
} = stockLevelSlice.actions;

export const stocksSelector = (state) => state.stockLevels;

export default stockLevelSlice.reducer;

export const fetchStockLevels = () => async (dispatch) => {
    dispatch(setLoader(true));

    let url = `/stocklevel`;

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
            dispatch(getStockLevels({
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

export const fetchStockLevelsWithParams = (
    page = 1,
    page_size = 20,
    ordering = 'description',
    include_archived = false
) => async (dispatch) => {
    dispatch(setLoader(true));

    if (page == 0)
        page = 1;

    let url = `/stocklevel?&page=${page}&page_size=${page_size}&ordering=${ordering}&include_archived=${include_archived}`;

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
            dispatch(getStockLevels({
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

export const searchStockLevels = (
    page_size = 20,
    ordering = 'description',
    include_archived = false,
    batch_number = ''
) => async (dispatch) => {
    dispatch(setLoader(true));

    let url = `/stocklevel?page_size=${page_size}&ordering=${ordering}&include_archived=${include_archived}`;

    if (batch_number && batch_number != '')
        url += `&batch_number__icontains=${batch_number}`;

    await axios.get(url, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Token ${process.env.REACT_APP_TOKEN}`
        },
        withCredentials: false,
    })
        .then((res) => {
            dispatch(setLoader(false));
            dispatch(getStockLevels({
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

