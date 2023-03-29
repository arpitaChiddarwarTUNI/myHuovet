import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setLoader } from "./loadingSlice";

const initialState = {
    count: 0,
    num_pages: 0,
    next: null,
    previous: null,
    results: [],
};

const departmentSlice = createSlice({
    name: "departments",
    initialState: initialState,
    reducers: {
        getDepartments(state, action) {
            return action.payload;
        }
    },
});

export const {
    getDepartments
} = departmentSlice.actions;

export const itemsSelector = (state) => state.departments;

export default departmentSlice.reducer;

export const fetchDepartments = (
) => async (dispatch) => {
    dispatch(setLoader(true));

    let url = `/department?page_size=1000&include_archived=false`;

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
            dispatch(getDepartments({
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
