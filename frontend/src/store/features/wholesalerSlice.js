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

const wholesalerSlice = createSlice({
    name: "wholesalers",
    initialState: initialState,
    reducers: {
        getWholesalers(state, action) {
            return action.payload;
        }
    },
});

export const {
    getWholesalers
} = wholesalerSlice.actions;

export const wholesalersSelector = (state) => state.wholesalers;

export default wholesalerSlice.reducer;

export const fetchWholesalers = (
    page = 1,
    page_size = 20,
    ordering = 'id',
    include_archived = false,
) => async (dispatch) => {

    dispatch(setLoader(true))

    if (page == 0)
        page = 1;

    let url = `/wholesaler?&page=${page}&page_size=${page_size}&ordering=${ordering}&include_archived=${include_archived}`;

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
            dispatch(getWholesalers({
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

export const saveWholesaler = (wholesaler, showToast) => async (dispatch) => {

    if (wholesaler.id && wholesaler.id != 0)
    {
        // Update
        await axios
        .put(`/wholesaler/${wholesaler.id}/`, wholesaler, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${process.env.REACT_APP_TOKEN}`
            },
            withCredentials: false,
        })
        .then((res) => {
            showToast('success', 'Saved', 'Wholesaler saved successfully!');
            dispatch(getWholesalers(res.data));
        })
        .catch((error) => {
            showToast('error', 'Error', 'Failed to save wholesaler');
            console.log(error);
        });
    } else {
        // Add 
        await axios
        .post(`/wholesaler/`, wholesaler, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${process.env.REACT_APP_TOKEN}`
            },
            withCredentials: false,
        })
        .then((res) => {
            showToast('success', 'Saved', 'Wholesaler saved successfully!');
            dispatch(getWholesalers(res.data));
        })
        .catch((error) => {
            showToast('error', 'Error', 'Failed to save wholesaler');
            console.log(error);
        });
    }
    
};

export const deleteWholesaler = (id) => async (dispatch) => {
    await axios
        .delete(`/wholesaler/${id}/`,
            {
                withCredentials: false,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Token ${process.env.REACT_APP_TOKEN}`
                }
            }
        )
        .then((res) => {

        })
        .catch((error) => {});
}
