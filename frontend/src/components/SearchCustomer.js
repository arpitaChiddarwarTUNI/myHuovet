import { Autocomplete, Paper, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCustomer } from "../store/features/customerSlice";
import { fetchPatients } from "../store/features/patientsSlice";
import { useDispatch } from "react-redux";
import { getPatients } from "../store/features/patientsSlice";
import { getCustomer } from "../store/features/customerSlice";

export default function SearchCustomer({ appointment }) {
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const debounce = (func) => {
    let timer;
    return function (...args) {
      const context = this;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        timer = null;
        func.apply(context, args);
      }, 500);
    };
  };

  const handleChange = async (value) => {
    await axios
      .get(`${process.env.REACT_APP_CUSTOMER_URL}/customer/search/${value}`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => setSuggestions(response.data))
      .catch((error) => {
        setSuggestions([]);
      });
  };

  const optimizedFn = useCallback(debounce(handleChange), []);

  const goToCustomer = (value) => {
    // if this search component is rendered from appointment, no navigation is wanted
    if (!appointment) {
      navigate(`/customer/${value.id}`);
    } else {
      if (value) {
        dispatch(fetchCustomer(value.id));
        dispatch(fetchPatients(value.id));
      } else {
        dispatch(getPatients({ patients: [], loading: false, error: "" }));
        dispatch(getCustomer({ customer: {}, loading: false, error: "" }));
      }
    }
  };

  return (
    <Box>
      <Autocomplete
        id="search"
        options={suggestions}
        noOptionsText="Kirjoita asiakkaan nimi"
        getOptionLabel={(option) => option.first_name + " " + option.last_name}
        onInputChange={(e) => optimizedFn(e.target.value)}
        onChange={(event, value) => goToCustomer(value)}
        filterOptions={(x) => x}
        PaperComponent={({ children }) => (
          <Paper style={{ background: "white" }}>{children}</Paper>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Etsi asiakkuutta"
            variant="filled"
            sx={{
              backgroundColor: "white",
              borderRadius: 1,
              marginBottom: 1,
            }}
          />
        )}
        renderOption={(props, option) => {
          return (
            <li {...props} key={option.id}>
              {option.first_name} {option.last_name}
            </li>
          );
        }}
      />
    </Box>
  );
}
